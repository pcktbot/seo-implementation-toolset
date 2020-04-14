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
              :filter="getStatus"
              sticky-header="40rem"
              responsive="true"
              striped
              hover
              head-variant="light"
              bordered
              class="table mt-1 mb-1"
            >
              <template v-slot:head(status)="data">
                {{ data.field.label }}
                <span>
                  <b-form-select
                    id="filter"
                    v-model="filter.selected"
                    :options="filter.options"
                    class="w-50"
                  />
                </span>
              </template>
              <template v-slot:cell(updatedAt)="data">
                {{ formattedDate(data.value) }}
              </template>
              <template v-slot:cell(feedbackText)="data">
                <b-form-textarea
                  id="feedback-text"
                  v-model="data.value"
                  disabled
                />
              </template>
              <template v-slot:cell(resolutionNotes)="data">
                <b-form-textarea
                  id="textarea-default"
                  v-model="data.value"
                  @input="onChangeCell($event, data.item.id, 'resolutionNotes')"
                  placeholder="Enter Resolution Note"
                />
              </template>
              <template v-slot:cell(status)="data">
                <b-form-select
                  id="status"
                  :value="data.value"
                  :options="status.options"
                  @input="onChangeCell($event, data.item.id, 'status')"
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
// import testfeedback from '~/server/config/testfeedback'
import moment from 'moment'
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
      filter: {
        selected: null,
        options: [
          { value: null, text: 'Filter Status' },
          { value: 'pending', text: 'Pending' },
          { value: 'open', text: 'Open' },
          { value: 'accepted', text: 'Accepted' },
          { value: 'fixed', text: 'Fixed' },
          { value: 'rejected', text: 'Rejected', class: 'bg-color' },
          { value: 'future', text: 'Future Consideration' }
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
            key: 'resolutionNotes',
            label: 'Resolution Notes',
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
    getStatus() {
      return this.filter.selected
    }
  },
  created() {
    this.$axios.$get(`api/feedback`).then((res) => {
      this.feedbacktbl.items = res
    })
  },
  methods: {
    onChangeCell(text, feedBackID, field) {
      const feedbackIndex = this.feedbacktbl.items.findIndex(obj => obj.id === feedBackID)
      this.feedbacktbl.items[feedbackIndex][field] = text
      this.$axios.put(`api/feedback/${feedBackID}`, {
        [field]: text
      })
    },
    formattedDate(date) {
      return moment(new Date(date)).format('MM-DD-YY')
    }
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
