<template>
  <b-card no-body class="my-5 py-2">
    <b-card-header class="text-left">
      <h4 class="mb-0">
        Step 3: Fill in Client Data
      </h4>
    </b-card-header>
    <b-tabs card content-class="my-2">
      <b-tab>
        <template v-slot:title>
          <div class="d-flex justify-content-start align-items-center mb-0">
            <div v-if="!stepOneComplete">
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
          @step-1-save="saveStepOne"
          @update-step-status="updateProp"
        />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <div class="d-flex justify-content-start align-items-center mb-0">
            <div v-if="!stepTwoComplete">
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
          :inputs="stepTwoFields"
          :keywords="stepTwoKeywordAreas"
          :phrases="stepTwoPhraseAreas"
          :location="location"
          :initialSelect="initialSelect"
          @step-update="onUpdate"
          @step-2-save="saveStepOne"
          @update-step-status="updateProp"
        />
      </b-tab>
      <b-tab title="Context">
        <p>I'm the third tab</p>
      </b-tab>
      <b-tab title="Redirects">
        <p>I'm the fourth tab</p>
      </b-tab>
      <b-tab title="Notes">
        <p>I'm the fifth tab</p>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import NameAddress from '~/components/steps/name-address'
import KeywordResearch from '~/components/steps/keyword-research'
export default {
  components: {
    NameAddress,
    KeywordResearch
  },
  props: {
    location: {
      type: Object,
      default() {
        return {}
      }
    },
    initialSelect: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      stepOneComplete: false,
      stepTwoComplete: false,
      validation: {
        steponefields: [
          'name',
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
              'community_amenity_1'
            ],
            other: [
              'neighborhood',
              'neighborhood_2',
              'landmark_1_name'
            ]
          },
          keywords: {
            mf: [
              'neighborhood keywords',
              'landmark keywords',
              'amenity keywords'
            ],
            other: [
              'neighborhood keywords',
              'landmark keywords'
            ]
          },
          phrases: {
            mf: [
              'neighborhood phrases',
              'landmark phrases',
              'amenity phrases'
            ],
            other: [

              'neighborhood phrases',
              'landmark phrases'
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
    stepTwoFields() {
      return this.initialSelect.vertical === 'mf'
        ? this.validation.steptwofields.inputs.mf
        : this.validation.steptwofields.inputs.other
    },
    stepTwoKeywordAreas() {
      return this.initialSelect.vertical === 'mf'
        ? this.validation.steptwofields.keywords.mf
        : this.validation.steptwofields.keywords.other
    },
    stepTwoPhraseAreas() {
      return this.initialSelect.vertical === 'mf'
        ? this.validation.steptwofields.phrases.mf
        : this.validation.steptwofields.phrases.other
    }
  },
  methods: {
    onUpdate(data) {
      this.$emit('stepper-updated', data)
    },
    updateProp(prop, value) {
      this[prop] = value
    },
    saveStepOne(data) {
      this.stepOneComplete = true
      const valFieldKeys = this.validation.fields
      this.$emit('step-1-save', data, valFieldKeys)
    }
  }
}
</script>

<style scoped>

</style>
