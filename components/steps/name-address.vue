<template>
  <b-container fluid>
    <usps-modal
      :form="form"
      :res="res"
      @update-address="updateAddress"
    />
    <b-row>
      <b-col
        v-for="input in inputs.fields"
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
        v-if="initData.selects[0].value === 'mf'"
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
        v-if="initData.selects[1].value === 'single'"
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
        v-if="initData.selects[0].value === 'mf'"
        cols="12"
        md="4"
        class="align-self-center mb-2"
      >
        <label for="property_feature_1">PROPERTY FEATURE</label>
        <b-form-select
          id="property_feature_1"
          :value="pickPropertyVal"
          :options="inputs.propertyvalue.options"
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
        <span :id="verifyAddTip" class="block" tabindex="0">
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
          <b-tooltip target="address-tip" variant="secondary" placement="auto">
            complete address fields
          </b-tooltip>
        </span>
      </b-col>
    </b-row>
    <b-row class="align-items-center">
      <b-col class="text-right py-0">
        <save-step
          :isDisabled="validateStepOne1"
          :saveData="saveData"
          :tooltipID="displaySaveTip"
          @step-save="onSave"
          @step-update="onInput"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import UspsModal from '~/components/modals/usps-modal'
import SaveStep from '~/components/save-step'
import States from '~/mixins/states'
export default {
  components: {
    UspsModal,
    SaveStep
  },
  mixins: [States],
  props: {
    inputs: {
      type: Object,
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
    initData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      saveData: {
        tooltipTargetID: 'step-one-tip',
        stepUpdateTxt: 'stepOneComplete'
      },
      res: null,
      uspsLink: 'https://tools.usps.com/zip-code-lookup.htm?byaddress',
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
          { value: null, text: 'Is Location Address USPS Verified?' },
          { value: true, text: 'Yes - USPS Verified' },
          { value: false, text: 'No - Not USPS Verified' }
        ]
      }
    }
  },
  computed: {
    disabledAddress() {
      return !this.validateAddFields()
    },
    pickPropertyVal() {
      const propertyFeatureVal = this.location.properties.property_feature_1
      return propertyFeatureVal || null
    },
    getStates() {
      const country = this.location.properties.country
      return this.location.properties.country
        ? this.states[country].options
        : [{ value: null, text: 'Select Country for States' }]
    },
    verifyAddTip() {
      return !this.validateAddFields() ? 'address-tip' : 'not-disabled'
    },
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
          uspsvalid: this.location.properties.uspsvalid,
          floor_plans: this.location.properties.floor_plans,
          property_feature_1: this.location.properties.property_feature_1,
          custom_slug: this.location.properties.custom_slug
        }
      },
      set(val) {}
    }
  },
  methods: {
    validateAddFields() {
      return (this.location.properties.street_address_1 &&
        this.location.properties.city &&
        this.location.properties.state &&
        this.location.properties.postal_code)
    },
    onSave() {
      this.$emit('step-save')
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
      try {
        const res = await this.$axios.post('/routes/uspsapi/verify-address', { form: this.form })
        this.res = res
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        this.res = null
      }
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
