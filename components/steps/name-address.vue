<template>
  <b-container fluid>
    <usps-modal
      :form="form"
      :res="res"
      @update-address="updateAddress"
    />
    <b-row class="align-items-center">
      <b-col class="text-right pt-0">
        <span :id="displaySaveTip" class="d-inline-block" tabindex="0">
          <b-btn
            :disabled="validateStepOne1"
            @click="onSave('stepOneComplete')"
            variant="outline-secondary--darken3"
            class="px-4"
          >
            {{ saveTxt }}
          </b-btn>
        </span>
        <b-tooltip target="step-one-tip" placement="left" variant="secondary">
          complete step to save
        </b-tooltip>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="input in inputs"
        :key="input"
        cols="12"
        md="4"
      >
        <b-form-group
          :id="`input-group-${input}`"
          :label="input.replace(/_/g,' ')"
          :label-for="`input-${input}`"
          class="text-left text-uppercase mb-0"
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
        cols="12"
        md="4"
        class="align-self-center mb-2"
      >
        <label for="state">STATE</label>
        <b-form-select
          id="state"
          :value="form.state"
          :state="form.state !== null"
          :options="states.options"
          @change="onInput('state', $event)"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
        class="align-self-center mb-2"
      >
        <label for="postal_code">POSTAL CODE</label>
        <b-form-input
          id="postal_code"
          :value="form.postal_code"
          :state="validation('postal_code')"
          @input="onInput('postal_code', $event)"
          placeholder="Enter postal code"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
        class="align-self-center mb-2"
      >
        <label for="country">COUNTRY</label>
        <b-form-select
          id="country"
          :value="form.country"
          :state="form.country !== null"
          :options="country.options"
          @change="onInput('country', $event)"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
        class="align-self-center mb-2"
      >
        <label for="population">POPULATION</label>
        <b-form-input
          id="population"
          :value="form.population"
          :state="validation('population')"
          @input="onInput('population', $event)"
          placeholder="Enter population"
          type="number"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
        class="align-self-center mb-2"
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
        cols="12"
        md="4"
        class="align-self-center address-col"
      >
        <b-btn
          v-b-modal.usps-modal
          @click="verifyAddress"
          variant="outline-secondary--darken3"
          class="px-4"
          block
        >
          Verify Address
        </b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import UspsModal from '~/components/modals/usps-modal'
import SaveStep from '~/mixins/savestep'
import States from '~/mixins/states'
export default {
  components: {
    UspsModal
  },
  mixins: [SaveStep, States],
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
    }
  },
  data () {
    return {
      saveTxt: 'Save',
      res: null,
      uspsLink: 'https://tools.usps.com/zip-code-lookup.htm?byaddress',
      states: this.getStates(),
      country: {
        selected: null,
        options: [
          { value: null, text: 'Select Country' },
          { value: 'US', text: 'United States' },
          { value: 'CA', text: 'Canada' }
        ]
      },
      uspsvalid: {
        selected: null,
        options: [
          { value: null, text: 'Is Location Adress USPS Verified?' },
          { value: true, text: 'Yes - USPS Verified' },
          { value: false, text: 'No - Not USPS Verified' }
        ]
      }
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
    onInput(key, val) {
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
  .address-col {
    padding-top: 1.75rem!important;
  }
</style>
