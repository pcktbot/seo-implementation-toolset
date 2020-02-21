<template>
  <b-card no-body class="my-5">
    <b-card-header class="d-flex justify-content-between text-left">
      <h3 class="my-auto">
        Step 3: Fill in Client Data
      </h3>
      <div class="my-auto">
        {{ `Address: ${location.properties.street_address_1} ${location.properties.city} ${location.properties.state} ${location.properties.postal_code}` }}
      </div>
    </b-card-header>
    <b-tabs card content-class="my-2">
      <b-tab>
        <template v-slot:title>
          <div class="d-flex justify-content-start align-items-center mb-0">
            <div v-if="!location.properties.stepOneComplete">
              <b-icon icon="x-circle" variant="warning" />
            </div>
            <div v-else>
              <b-icon icon="check-circle" variant="success" />
            </div>
            <!-- SOME COMPLETED INDICATION HERE -->
            Name / Adress Validation
          </div>
        </template>
        <name-address
          :inputs="validation.steponefields"
          :location="location"
          :uspsvalid="uspsvalid"
          @step-update="onUpdate"
          @step-save="onSave"
        />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <div class="d-flex justify-content-start align-items-center mb-0">
            <div v-if="!location.properties.stepTwoComplete">
              <b-icon icon="x-circle" variant="warning" />
            </div>
            <div v-else>
              <b-icon icon="check-circle" variant="success" />
            </div>
            <!-- SOME COMPLETED INDICATION HERE -->
            Keyword Research
          </div>
        </template>
        <keyword-research
          :inputs="stepTwoInputs"
          :keywords="stepTwoKeywordAreas"
          :phrases="stepTwoPhraseAreas"
          :location="location"
          :form="form"
          :validation="validation"
          @step-save="onSave"
          @step-update="onUpdate"
        />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <div class="d-flex justify-content-start align-items-center mb-0">
            <div v-if="!location.properties.stepThreeComplete">
              <b-icon icon="x-circle" variant="warning" />
            </div>
            <div v-else>
              <b-icon icon="check-circle" variant="success" />
            </div>
            <!-- SOME COMPLETED INDICATION HERE -->
            Redirects
          </div>
        </template>
        <redirects
          :location="location"
          :validation="validation"
          @add-rows="addRows"
          @step-save="onSave"
          @step-update="onUpdate"
          @cell-update="updateCell"
          @del-row="removeRow"
        />
      </b-tab>
      <b-tab title="Notes">
        <p>I'm the fourth tab</p>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import NameAddress from '~/components/steps/name-address'
import KeywordResearch from '~/components/steps/keyword-research'
import Redirects from '~/components/steps/redirects'
export default {
  components: {
    NameAddress,
    KeywordResearch,
    Redirects
  },
  props: {
    location: {
      type: Object,
      default() {
        return {}
      }
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      validation: {
        steponefields: [
          'name',
          'recommended_name',
          'street_address_1',
          'city',
          'state',
          'postal_code',
          'country',
          'population'
        ],
        steptwofields: {
          inputs: {
            mf: [
              'neighborhood',
              'neighborhood_2',
              'landmark_1_name',
              'apartment_amenity_1',
              'community_amenity_1',
              'floor_plans',
              'custom_slug'
            ],
            other: [
              'neighborhood',
              'neighborhood_2',
              'landmark_1_name',
              'custom_slug'
            ]
          },
          keywords: {
            mf: [
              'neighborhood_keywords',
              'landmark_keywords',
              'amenity_keywords'
            ],
            other: [
              'neighborhood_keywords',
              'landmark_keywords'
            ]
          },
          phrases: {
            mf: [
              'neighborhood_phrases',
              'landmark_phrases',
              'amenity_phrases'
            ],
            other: [
              'neighborhood phrases',
              'landmark phrases'
            ]
          },
          propertyvalue: {
            selected: null,
            options: [
              { value: null, text: 'Select Property Feature' },
              { value: 'Affordable', text: 'Affordable' },
              { value: 'Gated', text: 'Gated' },
              { value: 'Furnished', text: 'Furnished' },
              { value: 'Garden Style', text: 'Garden Style' },
              { value: 'High Rise', text: 'High Rise' },
              { value: 'New', text: 'New' },
              { value: 'Upgraded', text: 'Upgraded' },
              { value: 'Modern', text: 'Modern' },
              { value: 'Luxury', text: 'Luxury' }
            ]
          }
        },
        stepthreefields: {
          strategies: {
            selected: null,
            options: [
              { value: null, text: 'Select Strategy' },
              { value: 'Same Domain', text: 'Same Domain' },
              { value: 'Cross Domain', text: 'Cross Domain' },
              { value: 'Secure Cross Domain', text: 'Secure Cross Domain' },
              { value: 'Secure Naked Same Domain', text: 'Secure Naked Same Domain' },
              { value: 'No Redirects', text: 'No Redirects' }
            ]
          },
          wildcard: {
            selected: 'no',
            options: [
              { value: null, text: 'Select' },
              { value: 'no', text: 'No' },
              { value: 'yes', text: 'Yes' }
            ]
          }
        }
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
    stepTwoInputs() {
      const inputs = this.form.selects[0].value === 'mf'
        ? this.validation.steptwofields.inputs.mf
        : this.validation.steptwofields.inputs.other
      return this.form.selects[1].value === 'multi'
        ? inputs.slice(0, -1)
        : inputs
    },
    stepTwoKeywordAreas() {
      return this.form.selects[0].value === 'mf'
        ? this.validation.steptwofields.keywords.mf
        : this.validation.steptwofields.keywords.other
    },
    stepTwoPhraseAreas() {
      return this.form.selects[0].value === 'mf'
        ? this.validation.steptwofields.phrases.mf
        : this.validation.steptwofields.phrases.other
    }
  },
  methods: {
    selectedPropertyValue() {
      return this.form.selects[0].value === 'mf' && this.location.properties.property_feature_1
        ? this.location.properties.property_feature_1
        : null
    },
    onUpdate(data) {
      // eslint-disable-next-line no-console
      console.log(data)
      this.$emit('stepper-updated', data)
    },
    onSave(prop, value) {
      this.$emit('save-step')
    },
    addRows(rows, id) {
      this.$emit('add-rows', rows, id)
    },
    updateCell(key, val, index, col, id) {
      this.$emit('cell-update', key, val, index, col, id)
    },
    removeRow(index, id) {
      this.$emit('del-row', index, id)
    }
  }
}
</script>

<style scoped>

</style>
