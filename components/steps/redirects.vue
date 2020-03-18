<template>
  <b-container fluid>
    <b-row>
      <b-col class="text-center">
        <p class="font-italic">
          Please select a strategy and paste all redirects below
        </p>
      </b-col>
    </b-row>
    <b-row class="mx-auto px-0">
      <b-col class="align-self-center px-0 pb-3">
        <b-form-select
          id="strategy-selection"
          :state="validDropDown"
          :value="location.properties.redirectstrat"
          :options="validation.stepthreefields.options"
          @change="onInput('redirectstrat', $event)"
          class="w-50"
        />
      </b-col>
      <b-col class="text-center px-0 pb-3">
        <span :id="formatTip" class="d-inline-block" tabindex="0">
          <b-btn
            :disabled="btnDisabled"
            @click="formatRedirects"
            variant="outline-secondary--darken3"
            class="px-4"
          >
            Format Redirects
          </b-btn>
        </span>
        <b-tooltip target="format-tip" variant="danger">
          strategy and paste redirects
        </b-tooltip>
      </b-col>
      <b-col class="text-right px-0 pb-3">
        <span :id="displaySaveTip" class="d-inline-block" tabindex="0">
          <b-btn
            :disabled="!validateStep"
            @click="onSave"
            variant="outline-secondary--darken3"
            class="px-4"
          >
            Save
          </b-btn>
        </span>
        <b-tooltip target="disabled-wrapper" placement="topleft" variant="danger">
          complete step to save
        </b-tooltip>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-textarea
          id="redirects-text"
          @input="onInput('redirecttext', $event)"
          :value="form.redirecttext"
          placeholder="Paste your redirects here"
          class="text-left"
          rows="5"
          required
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          ref="redirectsTable"
          :fields="location.properties.redirects.fields"
          :items="location.properties.redirects.items"
          @row-selected="onRowSelected"
          selectable
          sticky-header="20rem"
          responsive
          striped
          hover
          head-variant="light"
          class="self-align-center table mt-4"
        >
          <template v-slot:cell(strategy)="data" class="align-self-center">
            <b-col
              style="width:10rem"
              class="p-0 m-0"
            >
              <b-form-select
                id="strat-selection"
                :value="data.value"
                :options="validation.stepthreefields.options"
                @change="onChangeCell('redirects', $event, data.index, 'strategy')"
              />
            </b-col>
          </template>
          <template v-slot:cell(current_url)="data">
            <b-form-input
              v-model="data.value"
              @input="onChangeCell('redirects', $event, data.index, 'current_url')"
            />
          </template>
          <template v-slot:cell(formatted_url)="data">
            <b-form-input
              v-model="data.value"
              @input="onChangeCell('redirects', $event, data.index, 'formatted_url')"
            />
          </template>
          <template v-slot:cell(select)="{ rowSelected }">
            <template v-if="rowSelected">
              <b-icon class="h4 mb-0" icon="check" variant="success" />
            </template>
            <template v-else>
              <b-icon class="h4 mb-0" icon="square" />
            </template>
          </template>
        </b-table>
        <b-row class="ml-0 mr-0">
          <b-col>
            <p>
              <b-button
                @click="selectAllRows"
                size="sm"
              >
                Select all
              </b-button>
              <b-button @click="clearSelected" size="sm">
                Clear selected
              </b-button>
              <b-button @click="toggleWildcard" size="sm">
                Toggle Selected Wildcard
              </b-button>
              <b-button @click="onTblDelete" variant="danger" size="sm">
                Delete Selected
              </b-button>
            </p>
          </b-col>
          <b-col class="text-left">
            <b-alert
              :show="hasMsg"
              :variant="alertvariant"
              @dismissed="hasMsg=false, alertvariant='', msg=''"
              dismissible
              class="redirect-alert m-0 px-1 py-1"
            >
              {{ msg }}
            </b-alert>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    location: {
      type: Object,
      default() {
        return {}
      }
    },
    validation: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      hasMsg: false,
      msg: '',
      alertvariant: ''
    }
  },
  computed: {
    formatTip() {
      return this.location.properties.redirectstrat === null ||
        (this.location.properties.redirecttext === '' &&
        this.location.properties.redirectstrat !== 'No Redirects')
        ? 'format-tip' : 'not-disabled'
    },
    displaySaveTip() {
      return !this.validateStepThree() ? 'disabled-wrapper' : 'not-disabled'
    },
    validateStep() {
      return this.location.properties.redirects.items.length > 0
    },
    validDropDown() {
      return !!this.location.properties.redirectstrat
    },
    btnDisabled() {
      return this.location.properties.redirectstrat === null ||
        (this.location.properties.redirecttext === '' &&
        this.location.properties.redirectstrat !== 'No Redirects')
    },
    isDisabled() {
      return this.location.properties.redirects.selected
    },
    form: {
      get() {
        return {
          redirecttext: this.location.properties.redirecttext,
          redirectstrat: this.location.properties.redirectstrat,
          redirects: this.location.properties.redirects
        }
      },
      set(val) {}
    }
  },
  methods: {
    validateStepThree() {
      return this.location.properties.redirects.items.length > 0
    },
    showMsg(msg, variant) {
      this.msg = msg
      this.alertvariant = variant
      this.hasMsg = true
    },
    getRedirectsArr() {
      // removes duplicates, non urls, urls already in table, bad file types
      const currentRedirects = this.getCurrentRedirects()
      const arrVal = this.form.redirecttext.split(/\n|,/g)
      const arrWODuplicates = arrVal.filter((item, index) => arrVal.indexOf(item) === index).filter(item => Boolean(item.trim()))
      return arrWODuplicates.filter((redirect) => {
        if (!currentRedirects.includes(redirect) && !this.invalidFile(redirect) && this.validURL(redirect)) {
          return redirect
        }
      })
    },
    validURL(str) {
      const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
      return !!pattern.test(str)
    },
    invalidFile(str) {
      const pattern = new RegExp('\\.(js|jpg|gif|json|jpeg|svg|xml|sitemap|pdf|css|svg|png)$', 'ig')
      return !!pattern.test(str)
    },
    // need to refactor this method
    // https://stackoverflow.com/questions/16576983/replace-multiple-characters-in-one-replace-call
    formatRedirect(redirect, strategy) {
      let formatted = 'N/A'
      if (strategy === 'Same Domain' && this.validURL(redirect)) {
        formatted = redirect.split(/\.com\/|\.com|\.net\/|\.org\/|\.co\//)[1] // strips everthing left of the TLD (ex: www.myapartments.com/units -> units)
          .split(/\.html|[?]/)[0] // strips everything to the right of .html or ?
        formatted = formatted.substr(-1) === '/' ? formatted.slice(0, -1) : formatted
        formatted = formatted.replace(/%20|\s/g, '\\s')
          .replace(/[[\]{}()*+?.,^$|#]/g, '\\$&') // escapes special characters with \
          .replace(/\/\//g, '/+') // replaces // with /+
          .replace(/%5B|%5b/g, '\\[')
          .replace(/%5D|%5d/g, '\\]')
          .replace(/%7C/g, '\\|')
        formatted = formatted.length === 1 ? `[${formatted}]` : `${formatted}$`
      }
      return formatted
    },
    getCurrentRedirects() {
      return this.location.properties.redirects.items.map(redirect => redirect.current_url)
    },
    formatRedirects() {
      const currentStrat = this.location.properties.redirectstrat
      if (!currentStrat) {
        this.showMsg('Please select strategy and paste redirects below', 'danger')
      } else {
        const table = currentStrat === 'No Redirects'
          ? [{ isActive: true, strategy: currentStrat, current_url: 'N/A', formatted_url: 'N/A' }]
          : []
        const redirectArr = this.getRedirectsArr()
        redirectArr.forEach((redirect) => {
          const cloudFormatted = this.formatRedirect(redirect, currentStrat)
          table.push({ isActive: true, strategy: currentStrat, current_url: redirect, formatted_url: cloudFormatted })
        })
        this.$emit('add-rows', table, { id: this.location.id })
        this.showMsg(`${table.length} Row/s Added`, `${table.length ? 'success' : 'danger'}`)
      }
    },
    onSave() {
      this.hasMsg = false
      const key = 'stepThreeComplete'
      const val = this.validateStepThree()
      if (val) {
        this.$emit('step-save')
      } else {
        this.showMsg('Please ensure table has itleast one row', 'danger')
      }
      this.$emit('step-update', { key, val, id: this.location.id })
    },
    onChangeCell(key, val, index, col) {
      this.$emit('cell-update', { key, val, index, col, id: this.location.id })
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    },
    onRowSelected(items) {
      this.$emit('select-location', items, 'redirecttbl')
    },
    selectAllRows() {
      this.$refs.redirectsTable.selectAllRows()
    },
    clearSelected() {
      this.$refs.redirectsTable.clearSelected()
    },
    onTblDelete() {
      if (this.location.properties.redirects.selected.length > 0) {
        this.$emit('delete-redirects')
      }
    },
    toggleWildcard() {
      this.$emit('toggle-wildcard')
      this.$refs.redirectsTable.clearSelected()
    }
  }
}
</script>

<style>
  .redirect-alert.alert-dismissible .close {
    padding: 0.25rem 1.25rem!important;
  }
</style>
