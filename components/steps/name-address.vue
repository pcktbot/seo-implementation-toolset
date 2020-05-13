<template>
  <b-container fluid>
    <usps-modal
      :res="uspsApiRes"
    />
    <b-row>
      <b-col
        v-for="input in iterableInputs"
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
          :options="getStates"
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
          :options="countryList.options"
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
          :options="uspsValidList.options"
          @change="onInput('uspsvalid', $event)"
        />
      </b-col>
      <b-col
        v-if="initSelects.selects[0].value === 'mf'"
        cols="12"
        md="4"
        class="align-self-center mb-2"
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
        class="align-self-center mb-2"
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
        v-if="initSelects.selects[0].value === 'mf'"
        cols="12"
        md="4"
        class="align-self-center mb-2"
      >
        <label for="property_feature_1">PROPERTY FEATURE</label>
        <b-form-select
          id="property_feature_1"
          :value="pickPropertyVal"
          :options="propertyValueList.options"
          :state="pickPropertyVal !== null"
          @change="onInput('property_feature_1', $event)"
          class="pb-1"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
        class="align-self-center address-col"
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
    </b-row>
    <b-row class="align-items-center">
      <b-col class="text-right py-0">
        <save-step
          :isDisabled="disabled"
          :saveData="saveData"
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
  data () { return {} },
  computed: {
    ...mapState({
      iterableInputs: state => state.nameAddress.fields,
      uspsApiRes: state => state.nameAddress.res,
      saveData: state => state.nameAddress.saveData,
      initSelects: state => state.initSelects,
      locations: state => state.locations.locations,
      location: state => state.selectedLocation.location,
      excludedFields: state => state.nameAddress.excludedRequiredFields,
      uspsValidList: state => state.nameAddress.uspsvalid,
      propertyValueList: state => state.nameAddress.propertyvalue,
      countryList: state => state.nameAddress.country,
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
      return country
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
      return valid
    },
    validateStepOne() {
      let valid = true
      const filteredForm = this.getRequiredFields()
      for (const prop in filteredForm) {
        if (filteredForm[prop] === '' || filteredForm[prop] === null) {
          valid = false
          break
        }
      }
      return valid
    },
    getRequiredFields() {
      const fieldsToExclude = this.excludedFields[this.initSelects.selects[1].value][this.initSelects.selects[0].value]
      const filtered = Object.keys(this.form)
        .filter(key => !fieldsToExclude.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.form[key]
          return obj
        }, {})
      return filtered
    },
    onInput(key, val) {
      this.onUpdate({ key, val, id: this.location.id })
      this.onUpdate({ key: this.saveData.stepUpdateTxt, val: !this.disabled, id: this.location.id })
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
  .address-col {
    padding-top: 1.75rem!important;
  }
</style>
