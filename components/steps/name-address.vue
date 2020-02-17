<template>
  <b-container fluid>
    <b-row class="align-items-center pb-2">
      <b-col class="text-left">
        <b-alert
          :show="hasMsg"
          :variant="alertvariant"
          @dismissed="hasMsg=false, alertvariant='', msg=''"
          dismissible
        >
          {{ msg }}
        </b-alert>
      </b-col>
      <b-col class="text-right">
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
      <b-col
        v-for="input in inputs"
        :key="input"
        cols="4"
      >
        <b-form-group
          :id="`input-group-${input}`"
          :label="input.replace(/_/g,' ')"
          :label-for="`input-${input}`"
          class="text-left text-uppercase"
        >
          <b-form-input
            :id="`input-${input}`"
            :value="form[input]"
            :placeholder="`Enter ${input}`"
            @input="onInput(input, $event)"
            required
          />
        </b-form-group>
      </b-col>
      <b-col
        cols="4"
        class="align-self-center mb-4"
      >
        <label for="uspsvalid">USPS Verified</label>
        <b-form-select
          id="uspsvalid"
          :value="form.uspsvalid"
          :options="uspsvalid.options"
          @change="onInput('uspsvalid', $event)"
        />
      </b-col>
      <b-col
        cols="4"
        class="align-self-center pt-3"
      >
        <b-btn
          :href="uspsLink"
          target="_blank"
          variant="outline-secondary--darken3"
          class="px-4"
        >
          Verify Address
        </b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    inputs: {
      type: Array,
      default() {
        return {}
      }
    },
    location: {
      type: Object,
      default() {
        return {}
      }
    },
    uspsvalid: {
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
      alertvariant: '',
      uspsLink: 'https://tools.usps.com/zip-code-lookup.htm?byaddress'
    }
  },
  computed: {
    form: {
      get() {
        return {
          name: this.location.name,
          recommendedname: this.location.properties.recommendedname,
          street_address_1: this.location.properties.street_address_1,
          city: this.location.properties.city,
          state: this.location.properties.state,
          postal_code: this.location.properties.postal_code,
          country: this.location.properties.country,
          population: this.location.properties.population,
          uspsvalid: this.location.properties.uspsvalid
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
    onSave() {
      this.hasMsg = false
      const validFields = this.validateStepOne()
      if (validFields) {
        this.$emit('step-1-save', 'stepOneComplete', true)
      } else {
        this.showMsg('Please ensure all fields are filled out')
        this.$emit('update-step-status', 'stepOneComplete', false)
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
