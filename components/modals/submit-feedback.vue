<template>
  <b-modal
    id="feedback-modal"
    :hide-footer="hidden"
    header-bg-variant="primary"
    size="lg"
    title="Submit Feedback"
  >
    <b-container fluid>
      <b-row>
        <b-col>
          <b-form-select
            id="property_feature_1"
            v-model="feedback.selected"
            :options="feedback.options"
            :state="feedback.selected !== null"
            class="mb-3"
          />
          <b-form-textarea
            id="feedback-text-area"
            :value="text"
            @input="onInput($event)"
            rows="4"
            placeholder="Enter feedback here"
            class="text-left mb-3"
            required
          />
          <b-button
            :disabled="disabledSubmit"
            @click="onSubmit"
            variant="secondary"
            block
            class="text-center"
          >
            Submit
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      feedback: {
        selected: null,
        options: [
          { value: null, text: 'Select Feedback Type' },
          { value: 'enhancement', text: 'Enhancement' },
          { value: 'bug', text: 'Bug' }
        ]
      },
      text: '',
      hidden: true
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    disabledSubmit() {
      return !(this.feedback.selected && this.text)
    }
  },
  methods: {
    onInput(txt) {
      this.text = txt
    },
    hide() {
      this.$bvModal.hide('feedback-modal')
    },
    async onSubmit() {
      await this.$axios.$post('api/feedback', {
        author: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
        feedbackType: this.feedback.selected,
        feedbackText: this.text,
        status: 'pending',
        resolutionNotes: ''
      })
      this.feedback.selected = null
      this.text = ''
      this.hide()
    }
  }
}
</script>

<style>
  footer {
    margin-top: 0em;
  }
</style>
