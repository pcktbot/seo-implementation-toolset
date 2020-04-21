<template>
  <b-card id="loctable" no-body class="loctable my-2">
    <b-card-header class="justify-content-between">
      <b-row class="my-auto text-center card-head">
        <b-col class="text-center" cols="12" md="4">
          <h5 class="mb-0">
            <strong>Name: </strong>{{ location.name }}
          </h5>
        </b-col>
        <b-col class="text-center" cols="12" md="4">
          <h5 class="mb-0">
            <b-link id="maps-link" :href="getMapsLink" target="_blank">
              <b-img
                src="/maps-icon.svg"
                width="22"
                height="22"
                class="maps-icon jello-vertical"
              />
            </b-link>
            <strong>Address: </strong>{{ `${location.properties.street_address_1} ${location.properties.city} ${location.properties.state} ${location.properties.postal_code}` }}
          </h5>
        </b-col>
        <b-col class="text-center" cols="12" md="4">
          <b-form-checkbox
            id="checkbox-1"
            :state="location.properties.prComplete"
            v-model="location.properties.prComplete"
            @change="updatePR('prComplete', $event)"
            name="check-button"
            size="lg"
          >
            <h5 class="mb-0">
              <strong> {{ getPRText }}</strong>
            </h5>
          </b-form-checkbox>
        </b-col>
      </b-row>
    </b-card-header>
    <b-tabs card content-class="my-2">
      <b-tab>
        <template v-slot:title>
          <tabs
            :text="stepOneText"
            :complete="stepOneComplete"
          />
        </template>
        <name-address
          :inputs="validation.steponefields"
          :location="location"
          :initData="form"
          @step-update="onUpdate"
          @step-save="onSave"
          @update-address="updateAddress"
        />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <tabs
            :text="stepTwoText"
            :complete="stepTwoComplete"
          />
        </template>
        <keyword-research
          :inputs="validation.steptwofields"
          :location="location"
          :form="form"
          @step-save="onSave"
          @step-update="onUpdate"
        />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <tabs
            :text="stepThreeText"
            :complete="stepThreeComplete"
          />
        </template>
        <redirects
          :location="location"
          :validation="validation"
          @add-rows="addRows"
          @step-save="onSave"
          @step-update="onUpdate"
          @cell-update="updateCell"
          @select-location="onRowSelected"
          @delete-redirects="onDelete"
          @toggle-wildcard="toggleWildcard"
        />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <tabs
            :text="stepFourText"
            :complete="stepFourComplete"
          />
        </template>
        <gmb
          :location="location"
          :form="form"
          @step-update="onUpdate"
          @step-save="onSave"
        />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import NameAddress from '~/components/steps/name-address'
import KeywordResearch from '~/components/steps/keyword-research'
import Redirects from '~/components/steps/redirects'
import Gmb from '~/components/steps/gmb'
import Tabs from '~/components/tabs'
export default {
  components: {
    NameAddress,
    KeywordResearch,
    Redirects,
    Gmb,
    Tabs
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
      stepOneText: 'Location Info Validation',
      stepTwoText: 'Keyword Research',
      stepThreeText: 'Redirects',
      stepFourText: 'GMB / GA / Strategy',
      validation: {
        steponefields: {
          fields: [
            'name',
            'recommended_name',
            'street_address_1',
            'city'
          ],
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
              { value: 'Luxury', text: 'Luxury' },
              { value: 'Townhome Style', text: 'Townhome Style' },
              { value: 'Smart', text: 'Smart' },
              { value: 'Upscale', text: 'Upscale' }
            ]
          }
        },
        steptwofields: {
          neighborhood: {
            inputs: ['neighborhood', 'neighborhood_2'],
            keywords: ['neighborhood_keywords', 'api_neighborhood_keywords'],
            phrases: ['neighborhood_phrases']
          },
          landmark: {
            inputs: ['landmark_1_name'],
            keywords: ['landmark_keywords', 'api_landmark_keywords'],
            phrases: ['landmark_phrases']
          },
          amenity: {
            inputs: ['apartment_amenity_1', 'community_amenity_1'],
            keywords: ['amenity_keywords'],
            phrases: ['amenity_phrases']
          }
        },
        stepthreefields: {
          options: [
            { value: null, text: 'Select Strategy' },
            { value: 'Same Domain', text: 'Same Domain' },
            { value: 'Cross Domain', text: 'Cross Domain' },
            { value: 'Secure Cross Domain', text: 'Secure Cross Domain' },
            { value: 'Secure Naked Same Domain', text: 'Secure Naked Same Domain' },
            { value: 'No Redirects', text: 'No Redirects' }
          ]
        }
      }
    }
  },
  computed: {
    getMapsLink() {
      return `https://www.google.com/maps/search/
        ${this.location.properties.street_address_1} 
        ${this.location.properties.city} 
        ${this.location.properties.state} 
        ${this.location.properties.postal_code}`
    },
    stepOneComplete() {
      return this.location.properties.stepOneComplete
    },
    stepTwoComplete() {
      return this.location.properties.stepTwoComplete
    },
    stepThreeComplete() {
      return this.location.properties.stepThreeComplete
    },
    stepFourComplete() {
      return this.location.properties.stepFourComplete
    },
    getPRText() {
      return this.location.properties.prComplete ? 'Peer Review Complete' : 'Peer Review Incomplete'
    }
  },
  methods: {
    updatePR(prop, value) {
      this.onUpdate({ key: prop, val: value, id: this.location.id })
    },
    selectedPropertyValue() {
      return this.form.selects[0].value === 'mf' && this.location.properties.property_feature_1
        ? this.location.properties.property_feature_1
        : null
    },
    onUpdate(data) {
      this.$emit('stepper-updated', data)
    },
    onSave(prop, value) {
      // eslint-disable-next-line no-console
      console.log('made-it')
      this.$emit('save-step')
    },
    addRows(rows, id) {
      this.$emit('add-rows', rows, id)
    },
    updateCell(key, val, index, col, id) {
      this.$emit('cell-update', key, val, index, col, id)
    },
    onRowSelected(items, tblname) {
      this.$emit('select-location', items, tblname)
    },
    onDelete() {
      this.$emit('delete-redirects')
    },
    toggleWildcard() {
      this.$emit('toggle-wildcard')
    },
    updateAddress(data) {
      this.$emit('update-address', data)
    }
  }
}
</script>

<style scoped>
  .tab-pane.card-body {
    padding-top: 1rem;
  }
  .maps-icon {
    vertical-align: top;
  }

</style>
