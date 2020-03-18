<template>
  <b-container fluid>
    <usps-modal
      :form="form"
      :res="res"
      @update-address="updateAddress"
    />
    <b-row class="align-items-center">
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
        <span :id="displaySaveTip" class="d-inline-block" tabindex="0">
          <b-btn
            :disabled="validateStepOne1"
            @click="onSave"
            variant="outline-secondary--darken3"
            class="px-4"
          >
            Save
          </b-btn>
        </span>
        <b-tooltip target="step-one-tip" placement="left" variant="danger">
          complete step to save
        </b-tooltip>
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
            :state="validation(input)"
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
          :state="form.uspsvalid !== null"
          :options="uspsvalid.options"
          @change="onInput('uspsvalid', $event)"
        />
      </b-col>
      <b-col
        cols="4"
        class="align-self-center pt-3"
      >
        <b-btn
          v-b-modal.usps-modal
          @click="verifyAddress"
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
import UspsModal from '~/components/modals/usps-modal'
export default {
  components: {
    UspsModal
  },
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
      res: null,
      msg: '',
      alertvariant: '',
      uspsLink: 'https://tools.usps.com/zip-code-lookup.htm?byaddress'
    }
  },
  computed: {
    displaySaveTip() {
      return !this.validateStepOne() ? 'step-one-tip' : 'not-disabled'
    },
    validateStepOne1() {
      const valid = this.validateStepOne()
      return !valid
    },
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
    validation(field) {
      let valid = true
      if (this.form[field] === '' || this.form[field] === null) {
        valid = false
      }
      if (field === 'recommended_name') valid = null
      return valid
    },
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
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    },
    onSave() {
      this.hasMsg = false
      const key = 'stepOneComplete'
      const val = this.validateStepOne()
      if (val) {
        this.$emit('step-save')
      } else {
        this.showMsg('Please ensure all fields are filled out')
      }
      this.$emit('step-update', { key, val, id: this.location.id })
    },
    async verifyAddress() {
      const res = await this.$axios.post('/routes/uspsapi/verify-address', { form: this.form })
      this.res = res
    },
    updateAddress(data) {
      this.$emit('update-address', data)
    }
  }
}
</script>

<style>

</style>
