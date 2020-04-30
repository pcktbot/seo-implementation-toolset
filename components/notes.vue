<template>
  <b-container fluid>
    <b-row>
      <b-col class="text-center pt-3">
        <b-form-group class="my-1">
          <b-form-radio-group
            id="btn-radios-2"
            v-model="toggle.selected"
            :options="getOptions"
            buttons
            button-variant="outline-primary"
            size="md"
            name="radio-btn-outline"
            class="w-75"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-textarea
          id="note-input"
          v-model="inputTxt"
          @input="onInput($event)"
          :placeholder="placeholderTxt"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span :id="submitTip" class="d-inline-block w-100" tabindex="0">
          <b-button
            :disabled="disabledSubmit"
            @click="onSubmit"
            type="submit"
            variant="secondary"
            block
          >
            Submit
          </b-button>
          <b-tooltip target="submit-tip" placement="topleft" variant="secondary">
            enter a note to submit
          </b-tooltip>
        </span>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mt-1">
        <h4 class="text-center mb-0">
          Comment History
        </h4>
        <b-table
          :fields="notestbl.fields"
          :items="getItems"
          responsive="sm"
          sticky-header="30rem"
          head-variant="light"
          class="comments text-left table"
          style="border: 1px solid rgba(0, 0, 0, 0.125)"
        >
          <template v-slot:cell(updatedAt)="data">
            {{ formattedDate(data.value) }}
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
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
    locationNotes: {
      type: Array,
      default() {
        return []
      }
    },
    projectNotes: {
      type: Array,
      default() {
        return []
      }
    },
    projectNoteField: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data () {
    return {
      saveTxt: 'Save',
      toggle: {
        selected: 'project'
      },
      notestbl: {
        fields: [
          {
            key: 'author',
            label: 'Name'
          },
          {
            key: 'updatedAt',
            label: 'Date'
          },
          {
            key: 'text',
            label: 'Comment'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    inputTxt: {
      get() {
        return this.toggle.selected === 'location'
          ? this.location.properties.locationNote
          : this.projectNoteField
      },
      set(val) {
        this.onLocationTab()
          ? this.$emit('stepper-updated', { key: 'locationNote', val, id: this.location.id })
          : this.$emit('project-data-input', { key: 'projectNoteField', val })
      }
    },
    getNotes() {
      return this.toggle.selected === 'location'
        ? this.locationNotes
        : this.projectNotes
    },
    getOptions() {
      return [
        { text: 'Project', value: 'project' },
        { text: 'Location', value: 'location', disabled: this.location === null }
      ]
    },
    disabledSubmit() {
      return !this.getTxt()
    },
    submitTip() {
      return !this.getTxt() ? 'submit-tip' : 'not-disabled'
    },
    placeholderTxt() {
      return this.toggle.selected === 'location'
        ? `Enter a Location Note for ${this.location.name}`
        : 'Enter a Project Note'
    },
    getItems() {
      return this.toggle.selected === 'location' ? this.locationNotes : this.projectNotes
    }
  },
  methods: {
    getTxt() {
      return this.onLocationTab() ? this.location.properties.locationNote : this.projectNoteField
    },
    onInput(val) {
      this.inputTxt = val
    },
    formattedDate(date) {
      return moment(new Date(date)).format('MM-DD-YY')
    },
    onLocationTab() {
      return this.toggle.selected === 'location'
    },
    onSubmit() {
      this.$emit('submit-note', this.toggle.selected)
    }
  }
}
</script>

<style>
 .comments tbody {
   font-size: .9rem;
 }
</style>
