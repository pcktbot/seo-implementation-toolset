<template>
  <b-container fluid>
    <usps-modal
      :res="nameAddress.res"
    />
    <b-row>
      <b-col
        v-for="input in nameAddress.fields"
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
      <b-col cols="12" md="4">
        <label for="state">STATE</label>
        <b-form-select
          id="state"
          :value="form.state"
          :state="form.state !== null"
          :options="getStates"
          @change="onInput('state', $event)"
        />
      </b-col>
      <b-col cols="12" md="4">
        <label for="postal_code">POSTAL CODE</label>
        <b-form-input
          id="postal_code"
          :value="form.postal_code"
          :state="validation('postal_code')"
          @input="onInput('postal_code', $event)"
          placeholder="Enter postal code"
        />
      </b-col>
      <b-col cols="12" md="4">
        <label for="country">COUNTRY</label>
        <b-form-select
          id="country"
          :value="form.country"
          :state="form.country !== null"
          :options="nameAddress.country.options"
          @change="onInput('country', $event)"
        />
      </b-col>
      <b-col
        v-if="notCorpOrBasic"
        cols="12"
        md="4"
      >
        <label for="population">POPULATION</label>
        <b-form-input
          id="population"
          :value="form.population"
          :state="validation('population')"
          @input="onInput('population', $event)"
          placeholder="Enter population"
        />
      </b-col>
      <b-col
        v-if="location.properties.corporate === 'false' || location.properties.corporate === 'FALSE'"
        cols="12"
        md="4"
      >
        <label for="uspsvalid">USPS Verified</label>
        <b-form-select
          id="uspsvalid"
          :value="form.uspsvalid"
          :state="form.uspsvalid !== null"
          :options="nameAddress.uspsvalid.options"
          @change="onInput('uspsvalid', $event)"
        />
      </b-col>
      <b-col
        v-if="mfNotCorpOrBasic"
        cols="12"
        md="4"
      >
        <label for="floor_plans">FLOOR PLANS</label>
        <b-form-input
          id="floor_plans"
          :value="form.floor_plans"
          :state="validation('floor_plans')"
          @input="onInput('floor_plans', $event)"
          placeholder="Enter floor plans"
        />
      </b-col>
      <b-col
        v-if="initSelects.selects[1].value === 'single'"
        cols="12"
        md="4"
      >
        <label for="custom_slug">CUSTOM SLUG</label>
        <b-form-input
          id="custom_slug"
          :value="form.custom_slug"
          :state="validation('custom_slug')"
          @input="onInput('custom_slug', $event)"
          placeholder="Enter custom slug"
        />
      </b-col>
      <b-col
        v-if="mfNotCorpOrBasicOrProf"
        cols="12"
        md="4"
      >
        <label for="property_feature_1">PROPERTY FEATURE</label>
        <b-form-select
          id="property_feature_1"
          :value="pickPropertyVal"
          :options="nameAddress.propertyvalue.options"
          :state="pickPropertyVal !== null"
          @change="onInput('property_feature_1', $event)"
          class="pb-1"
        />
      </b-col>
      <b-col
        v-if="domain === 'multi'"
        cols="12"
        md="4"
      >
        <label for="population">NAKED DOMAIN</label>
        <b-form-input
          id="domain"
          :value="form.naked_domain"
          :state="validation('naked_domain')"
          @input="onInput('naked_domain', $event)"
          placeholder="Enter naked domain"
        />
        <b-form-invalid-feedback id="domain">
          Invalid naked domain
        </b-form-invalid-feedback>
      </b-col>
      <b-col
        cols="12"
        md="4"
        class="btn-spacing"
      >
        <span :id="addressTip" class="block" tabindex="0">
          <b-btn
            v-b-modal.usps-modal
            :disabled="disabledAddress"
            @click="verifyAddress"
            variant="outline-secondary--darken3"
            class="px-4"
            block
          >
            Verify Address
          </b-btn>
          <b-tooltip target="address-tip" variant="secondary" placement="topleft">
            complete address fields
          </b-tooltip>
        </span>
      </b-col>
      <b-col class="text-right btn-spacing">
        <save-step
          :isDisabled="disabled"
          :saveData="nameAddress.saveData"
          :tooltipID="saveTip"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import UspsModal from '~/components/modals/usps-modal'
import SaveStep from '~/components/save-step'
import Locations from '~/mixins/locations'

export default {
  components: {
    UspsModal,
    SaveStep
  },
  mixins: [Locations],
  props: {},
  data () {
    return {
      validDomain: /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/i
    }
  },
  computed: {
    ...mapState({
      nameAddress: state => state.nameAddress,
      initSelects: state => state.initSelects,
      domain: state => state.initSelects.selects[1].value,
      location: state => state.selectedLocation.location,
      states: state => state.states
    }),
    ...mapGetters({
      form: 'selectedLocation/stepOneData'
    }),
    disabledAddress() {
      return !this.validateAddFields()
    },
    pickPropertyVal() {
      return this.form.property_feature_1 || null
    },
    getStates() {
      const country = this.location.properties.country
      return country === 'US' || country === 'CA'
        ? this.states[country].options
        : [{ value: null, text: 'Select Country for States' }]
    },
    addressTip() {
      return !this.validateAddFields() ? 'address-tip' : 'not-disabled'
    },
    saveTip() {
      return !this.validateStepOne() ? 'step-one-tip' : 'not-disabled'
    },
    disabled() {
      const valid = this.validateStepOne()
      return !valid
    },
    mfNotCorpOrBasicOrProf() {
      const locProp = this.location.properties
      return this.initSelects.selects[0].value === 'mf' &&
        (locProp.corporate === 'false' || locProp.corporate === 'FALSE') &&
        (locProp.service_level === 'elite' || locProp.service_level === 'enterprise')
    },
    mfNotCorpOrBasic() {
      const locProp = this.location.properties
      return this.initSelects.selects[0].value === 'mf' &&
        (locProp.corporate === 'false' || locProp.corporate === 'FALSE') &&
        (locProp.service_level === 'elite' || locProp.service_level === 'enterprise' || locProp.service_level === 'professional')
    },
    notCorpOrBasic() {
      const locProp = this.location.properties
      return (locProp.corporate === 'false' || locProp.corporate === 'FALSE') &&
        (locProp.service_level === 'elite' || locProp.service_level === 'enterprise')
    }
  },
  methods: {
    ...mapMutations({
      set: 'nameAddress/SET'
    }),
    validateAddFields() {
      return (this.location.properties.street_address_1 &&
        this.location.properties.city &&
        this.location.properties.state &&
        this.location.properties.postal_code)
    },
    validation(field) {
      let valid = true
      if (this.form[field] === '' || this.form[field] === null) {
        valid = false
      }
      if (field === 'recommended_name') valid = null
      if (field === 'naked_domain' && !this.validDomain.test(this.form.naked_domain)) {
        valid = false
      }
      return valid
    },
    validateStepOne() {
      let valid = true
      const filteredForm = this.getRequiredFields()
      for (const prop in filteredForm) {
        if (prop === 'naked_domain' && !this.validDomain.test(filteredForm.naked_domain)) {
          valid = false
          break
        } else if (filteredForm[prop] === '' || filteredForm[prop] === null) {
          valid = false
          break
        }
      }
      return valid
    },
    getRequiredFields() {
      const locProp = this.location.properties
      const domainStrat = this.initSelects.selects[1].value
      const vertical = this.initSelects.selects[0].value
      const sericeLevel = locProp.service_level
      const fieldsToExclude = locProp.corporate === 'false' || locProp.corporate === 'FALSE'
        ? this.nameAddress.excludedRequiredFields[domainStrat][vertical][sericeLevel]
        : this.nameAddress.corpExcludedFields
      const filtered = Object.keys(this.form)
        .filter(key => !fieldsToExclude.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.form[key]
          return obj
        }, {})
      return filtered
    },
    onInput(key, val) {
      this.onUpdate({ key, val })
      this.onUpdate({ key: this.nameAddress.saveData.stepUpdateTxt, val: !this.disabled })
    },
    async verifyAddress() {
      try {
        const result = await this.$axios.post('/routes/uspsapi/verify-address', { form: this.form })
        this.set({ 'res': result })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        this.set({ 'res': null })
      }
    }
  }
}
</script>
<style>
  .btn-spacing {
    padding-top: 2.24rem!important;
  }
</style>
