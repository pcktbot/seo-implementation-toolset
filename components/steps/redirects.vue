<template>
  <b-container fluid>
    <b-row>
      <b-col class="text-center">
        <p class="font-italic mb-0">
          Please select a strategy and paste all redirects below
        </p>
      </b-col>
    </b-row>
    <b-row class="mx-auto px-0">
      <b-col class="top-3 align-self-center px-0 pb-3 col-12 col-md">
        <b-form-select
          id="strategy-selection"
          :state="validDropDown"
          :value="location.properties.redirectstrat"
          :options="redirectsStore.options"
          @change="onInput('redirectstrat', $event)"
          class="w-50"
        />
      </b-col>
      <b-col class="top-3 text-center px-0 pb-3 col-12 col-md">
        <span :id="formatTip" tabindex="0">
          <b-btn
            :disabled="btnDisabled"
            @click="formatRedirects"
            variant="outline-secondary--darken3"
            class="px-4"
          >
            Format Redirects
          </b-btn>
          <b-tooltip target="format-tip" variant="secondary" placement="left">
            select strategy and paste redirects
          </b-tooltip>
        </span>
      </b-col>
      <b-col class="top-3 text-right px-0 pb-3 col-12 col-md">
        <save-step
          :isDisabled="disableSave"
          :saveData="redirectsStore.saveData"
          :tooltipID="displaySaveTip"
        />
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
          @row-selected="onRowSelected($event, 'redirecttbl')"
          selectable
          sticky-header="20rem"
          responsive
          striped
          hover
          head-variant="light"
          class="self-align-center table mt-2"
        >
          <!-- A custom formatted header cell for field 'current_url' -->
          <template v-slot:head(current_url)="data">
            {{ data.field.label }}
            <b-button @click="copyUrls('current_url')" class="p-0 m-0" variant="light">
              <b-img src="/copy-icon.png" width="20" height="20" class="jello-vertical" />
            </b-button>
            <span style="font-weight:normal;">{{ redirectsStore.current_url_msg }}</span>
          </template>
          <!-- A custom formatted header cell for field 'formatted_url' -->
          <template v-slot:head(formatted_url)="data">
            {{ data.field.label }}
            <b-button @click="copyUrls('formatted_url')" class="p-0 m-0" variant="light">
              <b-img src="/copy-icon.png" width="20" height="20" class="jello-vertical" />
            </b-button>
            <span style="font-weight:normal;">{{ redirectsStore.formatted_url_msg }}</span>
          </template>
          <template v-slot:cell(strategy)="data" class="align-self-center">
            <b-col
              style="width:10rem"
              class="p-0 m-0"
            >
              <b-form-select
                id="strat-selection"
                :value="data.value"
                :options="redirectsStore.options"
                @change="onChangeCell($event, data.index, 'strategy')"
              />
            </b-col>
          </template>
          <template v-slot:cell(current_url)="data">
            <b-form-input
              v-model="data.value"
              @input="onChangeCell($event, data.index, 'current_url')"
            />
          </template>
          <template v-slot:cell(formatted_url)="data">
            <b-form-input
              v-model="data.value"
              @input="onChangeCell($event, data.index, 'formatted_url')"
            />
          </template>
          <template v-slot:cell(select)="{ rowSelected }">
            <icons-swap
              :needsCheckIcon="rowSelected"
              :iconConfig="iconConfig"
            />
          </template>
        </b-table>
        <b-row class="ml-0 mr-0">
          <b-col class="pl-0">
            <b-button @click="selectAllRows" size="sm" class="mt-1 mb-1">
              Select all
            </b-button>
            <b-button @click="clearSelected" size="sm" class="mt-1 mb-1">
              Clear selected
            </b-button>
            <b-button @click="toggleWildcard" size="sm" class="mt-1 mb-1">
              Toggle Selected Wildcard
            </b-button>
            <b-button @click="onTblDelete" variant="danger" size="sm" class="mt-1 mb-1">
              Delete Selected
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import IconsSwap from '~/components/icons-swap'
import SaveStep from '~/components/save-step'
import Alert from '~/mixins/alert'
import TableMethods from '~/mixins/tableMethods'
export default {
  components: {
    SaveStep,
    IconsSwap
  },
  mixins: [Alert, TableMethods],
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      location: state => state.selectedLocation.location,
      redirectsStore: state => state.redirectStore,
      iconConfig: state => state.iconConfig
    }),
    ...mapGetters({
      form: 'selectedLocation/stepThreeData'
    }),
    formatTip() {
      return this.location.properties.redirectstrat === null ||
        (this.location.properties.redirecttext === '' &&
        this.location.properties.redirectstrat !== 'No Redirects')
        ? 'format-tip' : 'not-disabled'
    },
    displaySaveTip() {
      return !this.validateStepThree() ? 'step-three-tip' : 'not-disabled'
    },
    disableSave() {
      return !this.location.properties.redirects.items.length > 0
    },
    validDropDown() {
      return !!this.location.properties.redirectstrat
    },
    btnDisabled() {
      return this.location.properties.redirectstrat === null ||
        (this.location.properties.redirecttext === '' &&
        this.location.properties.redirectstrat !== 'No Redirects')
    }
  },
  methods: {
    ...mapMutations({
      setRedirectProp: 'redirectStore/SET',
      addRedirects: 'selectedLocation/ADD_REDIRECTS',
      updateProp: 'selectedLocation/UPDATE_PROP',
      updateCell: 'selectedLocation/UPDATE_CELL',
      deleteSelected: 'selectedLocation/DELETE_REDIRECTS',
      toggle: 'selectedLocation/TOGGLE_WILDCARD'
    }),
    copyUrls(type) {
      let str = ''
      this.form.redirects.items.forEach((obj) => {
        str = str ? `${str}\n${obj[type]}` : obj[type]
      })
      this.$copyText(str)
      this.setRedirectProp({ [`${type}_msg`]: 'Copied!' })
      // eslint-disable-next-line no-return-assign
      setTimeout(() => this.setRedirectProp({ [`${type}_msg`]: '' }), 3000)
    },
    validateStepThree() {
      return this.location.properties.redirects.items.length > 0
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
      const table = currentStrat === 'No Redirects'
        ? [{ isActive: true, strategy: currentStrat, current_url: 'N/A', formatted_url: 'N/A' }]
        : []
      const redirectArr = this.getRedirectsArr()
      redirectArr.forEach((redirect) => {
        const cloudFormatted = this.formatRedirect(redirect, currentStrat)
        table.push({ isActive: true, strategy: currentStrat, current_url: redirect, formatted_url: cloudFormatted })
      })
      this.addRedirects(table)
      this.updateProp({ key: this.redirectsStore.saveData.stepUpdateTxt, val: !this.disableSave })
      this.updateTxtField(table)
      this.showAlert(`${table.length} Row/s Added`, `${table.length ? 'success' : 'danger'}`)
    },
    updateTxtField(table) {
      const newTxt = this.form.redirecttext.split(/\n|,/g).filter((item) => {
        const arr = table.map(obj => obj.current_url)
        return !arr.includes(item)
      }).toString().replace(/,+/g, '\n')
      this.updateProp({ key: 'redirecttext', val: newTxt })
    },
    onChangeCell(val, index, col) {
      this.updateCell({ val, index, col })
    },
    onInput(key, val) {
      this.updateProp({ key, val })
    },
    selectAllRows() {
      this.$refs.redirectsTable.selectAllRows()
    },
    clearSelected() {
      this.$refs.redirectsTable.clearSelected()
    },
    onTblDelete() {
      if (this.location.properties.redirects.selected.length > 0) {
        this.deleteSelected()
        this.updateProp({ key: this.redirectsStore.saveData.stepUpdateTxt, val: !this.disableSave })
      }
    },
    toggleWildcard() {
      this.toggle()
      this.$refs.redirectsTable.clearSelected()
    }
  }
}
</script>

<style>
  .redirect-alert.alert-dismissible .close {
    padding: 0.25rem 1.25rem!important;
  }

@media only screen and (max-width: 768px) {
  .col-12 .btn {
    width: 100%;
    max-width: 100%;
  }
  #strategy-selection {
    width: 100%!important;
  }
}
</style>
