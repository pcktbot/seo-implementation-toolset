<template>
  <b-container fluid>
    <b-row>
      <b-col class="text-left" cols="12" md="4">
        <span class="font-weight-bold">Current Website: </span>{{ location.properties.current_website }}
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
        v-for="(select, index) in selects"
        :key="select.id"
        cols="12"
        md="4"
      >
        <b-form>
          <b-form-group
            :for="select.id"
            :label="select.id"
            class="pb-0 text-left text-uppercase"
          >
            <b-form-select
              :id="select.id"
              :value="location.properties[select.id]"
              :options="pickOptions(index)"
              @change="onInput(select.id, $event)"
            />
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-right pt-0" cols="12">
        <save-step
          :isDisabled="disabledSave"
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
import Strategies from '~/server/config/strategies'
import SaveStep from '~/components/save-step'
export default {
  components: {
    SaveStep
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
      strategies: Strategies,
      saveData: {
        tooltipTargetID: 'step-four-tip',
        stepUpdateTxt: 'stepFourComplete'
      },
      saveTxt: 'Save',
      options: [
        { value: null, text: 'Select Status' },
        { value: 'req', text: 'Requested' },
        { value: 'acc', text: 'Accessed' },
        { value: 'new', text: 'Create New' },
        { value: 'unverified', text: 'Unverified' },
        { value: 'basic', text: 'N/A Basic Package' },
        { value: 'clientmanaged', text: 'N/A - Client Managed' }
      ],
      selects: [
        {
          id: 'gmb',
          value: null

        },
        {
          id: 'ga',
          value: null
        },
        {
          id: 'strategy',
          value: null,
          mfoptions: {
            options: [
              { value: null, text: 'Select Strategy' },
              { value: 'mfa', text: 'MF A' },
              { value: 'mfb', text: 'MF B' },
              { value: 'mfc', text: 'MF C' },
              { value: 'townhomes', text: 'Townhomes' },
              { value: 'apartmentstownhomes', text: 'Apartments & Townhomes' },
              { value: 'mobile', text: 'Mobile Homes' },
              { value: 'fiftyfiveplus', text: '55+ Apartments' },
              { value: 'senior', text: 'Senior Apartments' },
              { value: 'student', text: 'Student Apartments' },
              { value: 'mfa1', text: 'MF A-1' },
              { value: 'mfb1', text: 'MF B-1' },
              { value: 'mfc1', text: 'MF C-1' },
              { value: 'mfa2', text: 'MF A-2' },
              { value: 'mfb2', text: 'MF B-2' },
              { value: 'mfc2', text: 'MF C-2' },
              { value: 'mfa3', text: 'MF A-3' },
              { value: 'mfb3', text: 'MF B-3' },
              { value: 'mfc3', text: 'MF C-3' },
              { value: 'mfa4', text: 'MF A-4' },
              { value: 'mfb4', text: 'MF B-4' },
              { value: 'mfc4', text: 'MF C-4' },
              { value: 'mfy', text: 'MF-Y' },
              { value: 'mfz', text: 'MF-Z' }

            ]
          },
          ssoptions: {
            options: [
              { value: null, text: 'Select Strategy' },
              { value: 'ssa', text: 'SS A' },
              { value: 'ssalandmark', text: 'SS A - Landmark' },
              { value: 'ssb', text: 'SS B' }
            ]
          },
          sloptions: {
            options: [
              { value: null, text: 'Select Strategy' },
              { value: 'sla', text: 'SL A' },
              { value: 'slb', text: 'SL B' },
              { value: 'slc', text: 'SL C' }
            ]
          }
        }
      ]
    }
  },
  computed: {
    disabledSave() {
      return !this.validateStepFour()
    },
    displaySaveTip() {
      return !this.validateStepFour() ? 'step-four-tip' : 'not-disabled'
    },
    getStrategyLink() {
      const vertical = this.form.selects[0].value
      const verticalStrategies = Object.keys(this.strategies[vertical])
      const strategy = this.location.properties.strategy
      return strategy && verticalStrategies.includes(strategy) ? this.strategies[vertical][strategy].link : ''
    },
    getStrategyText() {
      const vertical = this.form.selects[0].value
      const verticalStrategies = Object.keys(this.strategies[vertical])
      const strategy = this.location.properties.strategy
      return strategy && verticalStrategies.includes(strategy) ? this.strategies[vertical][strategy].description : ''
    }
  },
  methods: {
    onSave() {
      this.$emit('step-save')
    },
    validateStepFour() {
      const properties = this.location.properties
      return properties.gmb && properties.ga && properties.strategy
    },
    pickOptions(index) {
      const vertical = this.form.selects[0].value
      return index === 2 ? this.selects[2][`${vertical}options`].options : this.options
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    }
  }
}
</script>

<style>
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
