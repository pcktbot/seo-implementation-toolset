<template>
  <b-container fluid>
    <b-row>
      <b-col class="text-left" cols="12" md="4">
        <span class="font-weight-bold">Current Website: </span>{{ location.properties.current_website }}
      </b-col>
      <b-col v-if="location.properties.primary_type" class="text-left" cols="12" md="4">
        <span class="font-weight-bold">Property Type:</span> {{ location.properties.primary_type }}
      </b-col>
      <b-col class="text-right pt-0" cols="12" md="4">
        <span :id="displaySaveTip" tabindex="0">
          <b-btn
            :disabled="disabledSave"
            @click="onSave('stepFourComplete')"
            variant="outline-secondary--darken3"
            class="px-4"
          >
            {{ saveTxt }}
          </b-btn>
        </span>
        <b-tooltip target="step-four-tip" placement="topleft" variant="secondary">
          complete all dropdowns
        </b-tooltip>
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
  </b-container>
</template>

<script>
import CommentsMixin from '~/mixins/comments'
import SaveStep from '~/mixins/savestep'
export default {
  mixins: [CommentsMixin, SaveStep],
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
              { value: 'mfc', text: 'MF C' }
            ]
          },
          ssoptions: {
            options: [
              { value: null, text: 'Select Strategy' },
              { value: 'ssa', text: 'SS A' },
              { value: 'ssb', text: 'SS B' },
              { value: 'ssc', text: 'SS C' }
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
    }
  },
  methods: {
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
 .comment.card-title {
   text-align: center;
 }

@media only screen and (max-width: 768px) {
  .col-12 .btn {
    width: 100%;
    max-width: 100%;
  }
}
</style>
