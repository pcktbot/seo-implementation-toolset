<template>
  <div>
    <g5-nav />
    <div class="main-with-nav">
      <b-container fluid class="scroll-container">
        <b-row class="mt-2">
          <b-col class="text-center">
            <h1 class="font-weight-bold">
              FeedBack
            </h1>
          </b-col>
        </b-row>
        <b-row class="px-5">
          <b-col>
            <b-table
              ref="feedbackTable"
              :fields="feedbacktbl.fields"
              :items="feedbacktbl.items"
              sticky-header="40rem"
              responsive="true"
              striped
              hover
              head-variant="light"
              bordered
              class="table mt-1 mb-1"
            >
              <template v-slot:cell(feedbackType)="data">
                <b-form-select
                  id="feedback-type"
                  :value="data.value"
                  :options="type.options"
                />
              </template>
              <template v-slot:cell(feedbackText)="data">
                <b-form-textarea
                  id="feedback-text"
                  v-model="data.value"
                />
              </template>
              <template v-slot:cell(statusNotes)="data">
                <b-form-textarea
                  id="textarea-default"
                  v-model="data.value"
                  placeholder="Default textarea"
                />
              </template>
              <template v-slot:cell(status)="data">
                <b-form-select
                  id="status"
                  :value="data.value"
                  :options="status.options"
                />
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <g5-footer />
  </div>
</template>

<script>
import testfeedback from '~/server/config/testfeedback'
import g5Nav from '~/components/nav'
import g5Footer from '~/components/footer'
export default {
  components: {
    g5Nav,
    g5Footer
  },
  data () {
    return {
      type: {
        selected: null,
        options: [
          { value: null, text: 'Select Feedback Type' },
          { value: 'enhancement', text: 'Enhancement' },
          { value: 'bug', text: 'Bug' }
        ]
      },
      status: {
        selected: null,
        options: [
          { value: null, text: 'Select Status Type' },
          { value: 'pending', text: 'Pending' },
          { value: 'open', text: 'Open' },
          { value: 'accepted', text: 'Accepted' },
          { value: 'fixed', text: 'Fixed' },
          { value: 'rejected', text: 'Rejected', class: 'bg-color' },
          { value: 'future', text: 'Future Consideration' }
        ]
      },
      feedbacktbl: {
        fields: [
          {
            key: 'author',
            label: 'Name'
          },
          {
            key: 'updatedAt',
            label: 'Submitted Date',
            sortable: true
          },
          {
            key: 'feedbackType',
            label: 'Type'
          },
          {
            key: 'feedbackText',
            label: 'Note',
            class: 'text-center'
          },
          {
            key: 'statusNotes',
            label: 'Status Notes',
            class: 'text-center'
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            class: 'text-center'
          }
        ],
        items: []
      }
    }
  },
  computed: {
  },
  created() {
    this.feedbacktbl.items = testfeedback
  },
  methods: {
  }
}
</script>

<style scoped>
  table textarea {
    min-height: 4rem;
  }
  select#feedback-type.custom-select, select#status.custom-select {
    height: 4rem;
  }
</style>
