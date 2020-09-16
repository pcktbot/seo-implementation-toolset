<template>
  <b-container fluid>
    <cid-modal
      :res="gmbStore.res"
    />
    <b-row>
      <b-col class="text-left" cols="12" md="4">
        <span class="font-weight-bold">Current Website: </span>
        {{ location.properties.current_website }}
      </b-col>
      <b-col v-if="location.properties.primary_type" class="text-left" cols="12" md="4">
        <span class="font-weight-bold">Property Type:</span> {{ location.properties.primary_type }}
      </b-col>
      <b-col class="text-left" cols="12" md="4">
        <span class="font-weight-bold strat-link">Strategy Link:</span>
        <b-link id="strat-link" :href="getStrategyLink" target="_blank">
          {{ getStrategyText }}
        </b-link>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="(select) in selects"
        :key="select.id"
        cols="12"
        md="4"
      >
        <b-form>
          <b-form-group
            :for="select.id"
            :label="select.id"
            class="mb-0 pb-0 text-left text-uppercase"
          >
            <b-form-select
              :id="select.id"
              :state="validation(select.id)"
              :value="location.properties[select.id]"
              :options="pickOptions(select.id)"
              @change="onInput(select.id, $event)"
            />
          </b-form-group>
        </b-form>
      </b-col>
      <b-col
        v-if="(location.properties.corporate === 'false' || location.properties.corporate === 'FALSE')
          && (location.properties.service_level === 'elite' || location.properties.service_level === 'enterprise')"
        cols="12"
        md="4"
        class="align-self-center"
      >
        <label for="google_cid">GMB CID</label>
        <b-form-input
          id="google_cid"
          :value="location.properties.google_cid"
          @input="onInput('google_cid', $event)"
          placeholder="Enter GMB CID"
        />
      </b-col>
      <b-col
        v-if="(location.properties.corporate === 'false' || location.properties.corporate === 'FALSE')
          && (location.properties.service_level === 'elite' || location.properties.service_level === 'enterprise')"
        cols="12"
        md="4"
        class="align-self-center btn-spacing"
      >
        <b-btn
          v-b-modal.cid-modal
          @click="getCID"
          variant="outline-secondary--darken3"
          class="px-4"
          block
        >
          Get CID
        </b-btn>
      </b-col>
      <b-col
        cols="12"
        md="4"
        class="text-right align-self-center btn-spacing"
      >
        <save-step
          :isDisabled="disabledSave"
          :saveData="gmbStore.saveData"
          :tooltipID="displaySaveTip"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Strategies from '~/server/config/strategies'
import SaveStep from '~/components/save-step'
import CidModal from '~/components/modals/cid-modal'
export default {
  components: {
    SaveStep,
    CidModal
  },
  data () {
    return {
      content: 'text',
      strategies: Strategies
    }
  },
  computed: {
    ...mapState({
      location: state => state.selectedLocation.location,
      gmbStore: state => state.gmb,
      initSelects: state => state.initSelects,
      vertical: state => state.initSelects.selects[0].value,
      strategy: state => state.selectedLocation.location.properties.strategy
    }),
    selects() {
      const serviceLevel = this.location.properties.service_level
      return (this.location.properties.corporate === 'false' || this.location.properties.corporate === 'FALSE') &&
      (serviceLevel === 'elite' || serviceLevel === 'enterprise' || serviceLevel === 'professional')
        ? this.gmbStore.selects : this.gmbStore.selects.slice(1)
    },
    disabledSave() {
      return !this.validateStepFour()
    },
    displaySaveTip() {
      return !this.validateStepFour() ? 'step-four-tip' : 'not-disabled'
    },
    getStrategyLink() {
      const verticalStrategies = Object.keys(this.strategies[this.vertical])
      return this.strategy && verticalStrategies.includes(this.strategy)
        ? this.strategies[this.vertical][this.strategy].link : ''
    },
    getStrategyText() {
      const verticalStrategies = Object.keys(this.strategies[this.vertical])
      return this.strategy && verticalStrategies.includes(this.strategy)
        ? this.strategies[this.vertical][this.strategy].description : ''
    }
  },
  methods: {
    ...mapMutations({
      updateProp: 'selectedLocation/UPDATE_PROP',
      set: 'gmb/SET'
    }),
    handleInput(e) {
      this.content = e.target.innerHTML
    },
    validation(id) {
      return !!(this.location.properties[id])
    },
    validateStepFour() {
      const properties = this.location.properties
      return (properties.corporate === 'false' || properties.corporate === 'FALSE') &&
      (properties.service_level === 'elite' || properties.service_level === 'enterprise' || properties.service_level === 'professional')
        ? properties.gmb && properties.ga && this.strategy
        : properties.ga && this.strategy
    },
    pickOptions(id) {
      const selectIndex = this.gmbStore.selects.findIndex(select => select.id === id)
      return selectIndex === 2
        ? this.gmbStore.selects[selectIndex][`${this.vertical}options`]
        : this.gmbStore.selects[selectIndex].options
    },
    onInput(key, val) {
      this.updateProp({ key, val })
      this.updateProp({
        key: this.gmbStore.saveData.stepUpdateTxt,
        val: !this.disabledSave
      })
    },
    getAPIProps() {
      return {
        name: this.location.name,
        address: this.location.properties.street_address_1,
        city: this.location.properties.city,
        state: this.location.properties.state,
        zip: this.location.properties.postal_code,
        vertical: this.vertical
      }
    },
    getCID() {
      const props = this.getAPIProps()
      this.$axios.$put('/placesapi/cidRequest', { props })
        .then((result) => {
          this.set({ 'res': result })
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err)
          this.set({ 'res': null })
        })
    }
  }
}
</script>

<style>
.edit-text:focus { outline: none; }
 #strat-link {
  text-decoration: underline!important;
}
#strat-link:hover {
  color: var(--tertiary);
}
@media only screen and (max-width: 768px) {
  .col-12 .btn {
    width: 100%;
    max-width: 100%;
  }
}
</style>
