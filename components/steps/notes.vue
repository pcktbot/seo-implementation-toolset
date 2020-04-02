<template>
  <b-container fluid>
    <b-row>
      <b-col class="text-left">
        <span class="font-weight-bold">Current Website: </span>{{ location.properties.current_website }}
      </b-col>
      <b-col v-if="location.properties.primary_type" class="text-left">
        <span class="font-weight-bold">Property Type:</span> {{ location.properties.primary_type }}
      </b-col>
      <b-col class="text-right pt-0">
        <span :id="displaySaveTip" class="d-inline-block" tabindex="0">
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
      <b-col cols="10">
        <b-form-input
          id="note-input"
          v-model="location.properties.locationNote"
          @input="onInput('locationNote', $event)"
          placeholder="Enter a Note"
        />
      </b-col>
      <b-col>
        <span :id="submitTip" class="d-inline-block w-100" tabindex="0">
          <b-button
            :disabled="disabledSubmit"
            @click="$emit('submit-note')"
            type="submit"
            variant="primary"
            block
          >
            Submit
          </b-button>
        </span>
        <b-tooltip target="submit-tip" placement="topleft" variant="secondary">
          enter a note to submit
        </b-tooltip>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mt-3">
        <b-card title="Comment History" class="comment">
          <b-row class="font-weight-bold">
            <b-col cols="2">
              Author
            </b-col>
            <b-col cols="3">
              Date
            </b-col>
            <b-col>
              Comment
            </b-col>
          </b-row>
          <b-row
            v-for="note in locationNotes"
            :key="note.id"
            class="commentRow"
          >
            <b-col cols="2">
              <p class="m-0">
                {{ note.author }}
              </p>
            </b-col>
            <b-col cols="3">
              <p class="m-0">
                {{ formattedDate(note.createdAt) }}
              </p>
            </b-col>
            <b-col>
              <p class="m-0">
                {{ note.text }}
              </p>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import moment from 'moment'
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
    },
    locationNotes: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data () {
    return {
      comments: [],
      saveTxt: 'Save',
      newComment: {
        author: 'testUser',
        lpId: this.location.lpId,
        locationId: this.location.id,
        text: this.textarea
      },
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
    disabledSubmit() {
      return !this.validNoteInput()
    },
    disabledSave() {
      return !this.validateStepFour()
    },
    displaySaveTip() {
      return !this.validateStepFour() ? 'step-four-tip' : 'not-disabled'
    },
    submitTip() {
      return !this.validNoteInput() ? 'submit-tip' : 'not-disabled'
    }
  },
  methods: {
    validNoteInput() {
      return this.location.properties.locationNote
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
    },
    formattedDate(date) {
      return moment(new Date(date)).format('MMM Do YYYY, h:mm a')
    }
  }
}
</script>

<style>
 .comment.card-title {
   text-align: center;
 }
</style>
