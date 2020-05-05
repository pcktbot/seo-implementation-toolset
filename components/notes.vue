<template>
  <b-container fluid>
    <b-row>
      <b-col class="text-center pt-3">
        <b-form-group class="my-1">
          <b-form-radio-group
            id="btn-radios-2"
            v-model="selected"
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
          :fields="fields"
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
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import CommentsMixin from '~/mixins/comments'
export default {
  mixins: [CommentsMixin],
  data () {
    return {}
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      location: state => state.selectedLocation.location,
      locationNotes: state => state.notes.locationNotes,
      projectNotes: state => state.notes.projectNotes,
      projectNoteField: state => state.notes.projectNoteField,
      toggle: state => state.notes.toggle,
      saveTxt: state => state.notes.saveTxt,
      fields: state => state.notes.fields,
      lpId: state => state.initSelects.lpId
    }),
    selected: {
      get() { return this.toggle.selected },
      set(val) { this.$store.commit('notes/SET_TOGGLE', { val }) }
    },
    inputTxt: {
      get() {
        return this.toggle.selected === 'location'
          ? this.location.properties.locationNote
          : this.projectNoteField
      },
      set(val) {
        this.onLocationTab()
          ? this.$store.commit('locations/UPDATE_PROP', { key: 'locationNote', val, id: this.location.id })
          : this.$store.commit('notes/SET', { 'projectNoteField': val })
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
    ...mapMutations({
      setNotesData: 'notes/SET',
      updateLocationProp: 'locations/UPDATE_PROP'
    }),
    getTxt() {
      return this.onLocationTab() ? this.location.properties.locationNote : this.projectNoteField
    },
    formattedDate(date) {
      return moment(new Date(date)).format('MM-DD-YY')
    },
    onLocationTab() {
      return this.toggle.selected === 'location'
    },
    async onSubmit() {
      const onLocationTab = this.toggle.selected === 'location'
      const locID = onLocationTab ? this.location.id : null
      const txt = onLocationTab ? this.location.properties.locationNote : this.projectNoteField
      await this.postComment(
        {
          author: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
          lpId: this.lpId,
          locationId: locID,
          text: txt
        }
      )
      this.setNotes()
    },
    async setNotes() {
      await this.$store.dispatch('notes/GET_AND_SET', this.lpId)
      if (this.onLocationTab()) {
        const locNote = this.getLocationNotes(this.location.id)
        this.setNotesData({ 'locationNotes': locNote })
        this.inputTxt = ''
      } else {
        this.inputTxt = ''
      }
    },
    getLocationNotes(id) {
      return this.allNotes.filter(note => note.locationId === id)
    }
  }
}
</script>

<style>
 .comments tbody {
   font-size: .9rem;
 }
</style>
