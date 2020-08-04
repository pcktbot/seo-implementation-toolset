<template>
  <b-card id="loctable" no-body class="loctable my-2">
    <b-card-header class="justify-content-between">
      <b-row class="my-auto text-center card-head">
        <b-col class="text-center" cols="12" md="4">
          <h5 class="mb-0">
            <strong>Name: </strong>{{ location.name }}
          </h5>
        </b-col>
        <b-col class="text-center align-items-center" cols="12" md="4">
          <h5 class="mb-0">
            <b-link :href="getFBLink" target="_blank">
              <b-img src="/facebook.svg" class="maps-icon jello-vertical social-link" />
            </b-link>
            <b-link :href="getYelpLink" target="_blank">
              <b-img src="/yelp.svg" class="maps-icon jello-vertical social-link" />
            </b-link>
            <b-link :href="getSearchLink" target="_blank">
              <b-img src="/google-icon.svg" class="maps-icon jello-vertical social-link" />
            </b-link>
            <b-link :href="getMapsLink" target="_blank">
              <b-img src="/maps-icon.svg" class="maps-icon jello-vertical social-link" />
            </b-link>
            <strong>Address: </strong>
            {{ `${street_address_1} ${city} ${state} ${postal_code}` }}
          </h5>
        </b-col>
        <b-col class="text-center" cols="12" md="4">
          <b-form-checkbox
            id="checkbox-1"
            :state="prComplete"
            v-model="prComplete"
            name="check-button"
            height="1.2em"
            width="1.2em"
          >
            <h5 class="mb-0">
              {{ getPRText }}
            </h5>
          </b-form-checkbox>
        </b-col>
      </b-row>
    </b-card-header>
    <b-tabs v-model="tabIndex" card content-class="my-2" justified>
      <b-tab>
        <template v-slot:title>
          <tabs
            :text="stepOneText"
            :complete="stepOneComplete"
          />
        </template>
        <name-address />
      </b-tab>
      <b-tab v-if="location.properties.corporate === 'false'">
        <template v-slot:title>
          <tabs
            :text="stepTwoText"
            :complete="stepTwoComplete"
          />
        </template>
        <keyword-research />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <tabs
            :text="stepThreeText"
            :complete="stepThreeComplete"
          />
        </template>
        <redirects />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <tabs
            :text="stepFourText"
            :complete="stepFourComplete"
          />
        </template>
        <gmb />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import Alert from '~/mixins/alert'
import Locations from '~/mixins/locations'
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
  mixins: [Locations, Alert],
  data () {
    return {
      stepOneText: 'Location Info Validation',
      stepTwoText: 'Keyword Research',
      stepThreeText: 'Redirects',
      stepFourText: 'GMB / GA / Strategy'
    }
  },
  computed: {
    ...mapState({
      location: state => state.selectedLocation.location,
      stepOneComplete: state => state.selectedLocation.location.properties.stepOneComplete,
      stepTwoComplete: state => state.selectedLocation.location.properties.stepTwoComplete,
      stepThreeComplete: state => state.selectedLocation.location.properties.stepThreeComplete,
      stepFourComplete: state => state.selectedLocation.location.properties.stepFourComplete,
      street_address_1: state => state.selectedLocation.location.properties.street_address_1,
      city: state => state.selectedLocation.location.properties.city,
      state: state => state.selectedLocation.location.properties.state,
      postal_code: state => state.selectedLocation.location.properties.postal_code
    }),
    tabIndex: {
      get() { return this.$store.state.tabindex.index },
      set(index) { this.$store.commit('tabindex/set', index) }
    },
    prComplete: {
      get() { return this.location.properties.prComplete },
      set(value) {
        this.onUpdate({ key: 'prComplete', val: value })
        this.updatePRStatus()
      }
    },
    getFBLink() {
      return `https://www.facebook.com/search/top/?q=${this.location.name} ${this.city}, ${this.state}`
    },
    getYelpLink() {
      return `https://www.yelp.com/search?find_desc=${this.location.name}&find_loc=${this.city}, ${this.state}`
    },
    getSearchLink() {
      return `https://www.google.com/search?q=${this.location.name} ${this.street_address_1} ${this.city} ${this.state} ${this.postal_code}`
    },
    getMapsLink() {
      return `https://www.google.com/maps/search/${this.street_address_1} ${this.city} ${this.state} ${this.postal_code}`
    },
    getPRText() {
      return this.location.properties.prComplete
        ? 'Peer Review Complete' : 'Peer Review Incomplete'
    }
  }
}
</script>

<style scoped>
  .tab-pane.card-body {
    padding-top: 1rem;
  }
  .social-link {
     width: 20px;
     height: 20px;
     position: relative;
     bottom: 3px;
  }
</style>
