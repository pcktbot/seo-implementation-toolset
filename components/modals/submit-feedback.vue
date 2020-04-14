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
            {{ submitTxt }}
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
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
      submitTxt: 'Submit',
      hidden: true
    }
  },
  computed: {
    disabledSubmit() {
      return !(this.feedback.selected && this.text)
    }
  },
  methods: {
    onInput(txt) {
      this.text = txt
    },
    onSubmit() {
      this.text = ''
      this.submitTxt = 'Submitted!'
      // eslint-disable-next-line no-return-assign
      setTimeout(() => this.submitTxt = 'Submit', 3000)
    }
  }
}
</script>

<style>
  footer {
    margin-top: 0em;
  }
</style>
