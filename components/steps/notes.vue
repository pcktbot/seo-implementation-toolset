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
        <b-btn
          variant="outline-secondary--darken3"
          class="px-4"
        >
          Save
        </b-btn>
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
          placeholder="Enter a Note"
        />
      </b-col>
      <b-col>
        <b-button type="submit" variant="primary" block>
          Submit
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mt-3">
        <b-card class="h-100">
          <b-row
            v-for="note in locationNotes"
            :key="note.id"
          >
            <b-col>
              <p>{{ note.author }}</p>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CommentsMixin from '~/mixins/comments'
export default {
  mixins: [CommentsMixin],
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
    //
  },
  methods: {
    pickOptions(index) {
      const vertical = this.form.selects[0].value
      return index === 2 ? this.selects[2][`${vertical}options`].options : this.options
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    },
    async onSubmit() {
      await this.postComment(this.newComment)
      // eslint-disable-next-line no-console
      // console.log('submitted comment')
    },
    test(note) {
      // eslint-disable-next-line no-console
      console.log(note)
    }
  }
}
</script>

<style>

</style>
