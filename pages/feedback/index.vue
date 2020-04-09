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
              sticky-header="20rem"
              responsive="true"
              striped
              hover
              head-variant="light"
              bordered
              class="self-align-center table mt-1 mb-1"
            />
          </b-col>
        </b-row>
      </b-container>
    </div>
    <g5-footer />
  </div>
</template>

<script>

import g5Nav from '~/components/nav'
import g5Footer from '~/components/footer'
export default {
  components: {
    g5Nav,
    g5Footer
  },
  data () {
    return {
      feedbacktbl: {
        fields: [
          {
            key: 'author',
            label: 'Name'
          },
          {
            key: 'updatedAt',
            label: 'Date',
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
  async created() {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
