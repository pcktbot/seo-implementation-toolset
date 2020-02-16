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
          :value="validation.steptwofields.strategies.selected"
          :options="validation.steptwofields.strategies.options"
          class="w-50"
        />
      </b-col>
      <b-col class="text-center px-0 pb-3">
        <b-btn
          @click="formatRedirects"
          variant="outline-secondary--darken3"
          class="px-4"
        >
          Format Redirects
        </b-btn>
      </b-col>
      <b-col class="text-right px-0 pb-3">
        <b-btn
          @click="onSave"
          variant="outline-secondary--darken3"
          class="px-4"
        >
          Save
        </b-btn>
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
          :items="location.properties.redirects"
          responsive
          striped
          hover
        />
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
    validateStepOne() {
      let valid = true
      for (const prop in this.form) {
        if (this.form[prop] === '' || this.form[prop] === null) {
          valid = false
          break
        }
      }
      return valid
    },
    showMsg(msg) {
      this.msg = msg
      this.alertvariant = 'danger'
      this.hasMsg = true
    },
    getRedirectsArr() {
      const arrVal = this.form.redirecttext.split(/\n|,/g)
      return arrVal.filter((item, index) => arrVal
        .indexOf(item) === index).filter(item => Boolean(item.trim()))
    },
    formatRedirects() {
      const redirectArr = this.getRedirectsArr()
      console.log(redirectArr)
    },
    onSave() {
      this.hasMsg = false
      const validFields = this.validateStepOne()
      if (validFields) {
        this.$emit('step-3-save', 'stepThreeComplete', true)
      } else {
        this.showMsg('Please ensure all fields are filled out')
        this.$emit('update-step-status', 'stepThreeComplete', false)
      }
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    }
  }
}
</script>

<style>

</style>
