<template>
  <div>
    <g5-nav>
      <template v-slot:content>
        <b-alert
          :show="form.dismissCountDown"
          :variant="form.alertvariant"
          @dismiss-count-down="countDownChanged"
          @dismissed="form.alertvariant='', form.alertMsg=''"
          dismissible
          fade
        >
          {{ form.alertMsg }}
        </b-alert>
      </template>
    </g5-nav>
    <div class="main-with-nav">
      <drawer>
        <template v-slot:button-text>
          <b-icon icon="chat-fill" variant="primary" class="jello-vertical" />
        </template>
        <template v-slot:content>
          <notes
            :location="selectedLocation"
            :locationNotes="locationNotes"
            :projectNotes="projectNotes"
            :projectNoteField="projectNoteField"
            @submit-note="updateNotes"
            @stepper-updated="onUpdate"
            @project-data-input="updateProjectData"
          />
        </template>
      </drawer>
      <b-container fluid class="scroll-container">
        <b-row class="pt-4 px-5" style="background-color: Gainsboro">
          <b-col>
            <initial-selections
              :visible="visible"
              :form="form"
              @upload-data="onUpload"
              @field-update="updateSelect"
              @input-update="updateInput"
            />
          </b-col>
        </b-row>
        <accordion-toggle
          :visible="visible"
          @update-visibility="updateVisibility"
        />
        <b-row class="px-5" style="background-color: white">
          <b-col>
            <location-table
              :form="form"
              :locationtbl="locationtbl"
              :selectedLocation="selectedLocation"
              @delete-location="onDelete"
              @select-location="onRowSelected"
              @load-location="loadLocation"
              @export-locations="exportLocations"
              @save-step="onSave"
            />
          </b-col>
        </b-row>
        <b-row v-if="selectedLocation && !disabledUpload" class="px-5 pt-3 pb-4" style="background-color: var(--secondary--lighten3)">
          <b-col class="px-0">
            <form-stepper
              v-if="selectedLocation && !disabledUpload"
              :location="selectedLocation"
              :form="form"
              @stepper-updated="onUpdate"
              @save-step="onSave"
              @add-rows="addRows"
              @cell-update="updateCell"
              @select-location="onRowSelected"
              @delete-redirects="onDeleteRedirects"
              @toggle-wildcard="toggleWildcard"
              @update-address="updateAddress"
              @remove-keyword="removeKeyword"
              @update-keyword="updateKeyword"
              @add-keyword="addKeyword"
            />
          </b-col>
        </b-row>
      </b-container>
    </div>
    <g5-footer />
  </div>
</template>

<script>
// import Papa from 'papaparse'
import { mapState } from 'vuex'
import LocationTable from '~/components/location-table'
import FormStepper from '~/components/form-stepper'
import g5Nav from '~/components/nav'
import g5Footer from '~/components/footer'
import Notes from '~/components/notes'
import initialSelections from '~/components/initial-selections'
import AccordionToggle from '~/components/accordion-toggle'
import Index from '~/mixins/index'
import CommentsMixin from '~/mixins/comments'
import Drawer from '~/components/drawer'

export default {
  components: {
    LocationTable,
    FormStepper,
    g5Nav,
    g5Footer,
    initialSelections,
    AccordionToggle,
    Drawer,
    Notes
  },
  mixins: [Index, CommentsMixin],
  // addional data shared between index files in index mixins
  data () {
    return {
      visible: false, // in itit-selects store
      selectedLocation: null, // in selected loc store
      locationNotes: [], // in notes store
      projectNotes: [], // in notes store
      allNotes: [], // in notes store
      projectNoteField: '', // in notes store
      locations: [], // in locations store
      locationtbl: { // in locationsTable store
        fields: [
          {
            key: 'select',
            label: 'Select'
          },
          {
            key: 'location',
            label: 'Location Name',
            sortable: true
          },
          {
            key: 'edit',
            label: 'Edit'
          },
          {
            key: 'status',
            label: 'Complete',
            sortable: true,
            class: 'text-center'
          },
          {
            key: 'prstatus',
            label: 'PR Complete',
            sortable: true,
            class: 'text-center'
          }
        ],
        items: [],
        selectMode: 'multi',
        selected: []
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    disabledUpload() {
      const values = [this.form.inputs.lpId]
      this.form.selects.forEach(select => values.push(select.value))
      let valid = true
      for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
          valid = false
          break
        }
      }
      return !(valid)
    }
  },
  async fetch({ store }) {
    await store.dispatch('userInfo/get')
  },
  async created() {
    const { lpID } = this.$nuxt._route.params
    // loads initial selections
    try {
      await this.$axios.$get(`api/lp-project/${lpID}`).then((res) => {
        this.form.inputs.lpId = res[0].lpId
        this.form.selects.forEach((select) => {
          select.value = res[0][select.id]
        })
      })
      this.allNotes = await this.getAllNotes(lpID)
      this.projectNotes = this.getProjectNotes()
      const res = await this.$axios.$get(`api/locations/${lpID}`)
      // adds location data to front end and fills out location table
      this.locations = res
      // this.$store.commit('locations/setLocations', res) // sets locations to store
      // adds data to locations table
      this.locationtbl.items = [
        ...res.map((location) => {
          const { name, properties } = location
          return {
            select: false,
            location: `${name} - ${properties.street_address_1}`,
            status: properties.locationComplete,
            value: location.id,
            prstatus: properties.prComplete
          }
        })
      ]
      this.locationtbl.items.length > 0
        ? this.showAlert(this.form.successLoadMsg, 'success')
        : this.showAlert(this.form.errLoadMsg, 'danger')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      this.showAlert(this.form.errLoadMsg, 'danger')
    }
  },
  methods: {
    addKeyword({ key, val, id }) {
      const locIndex = this.getLocationIndex()
      const keywords = this.locations[locIndex].properties[key]
      const largestId = keywords.length > 0
        ? Math.max.apply(Math, keywords.map(function(o) { return o.id }))
        : 0
      keywords.push({ name: val, id: largestId + 1 })
    },
    removeKeyword({ key, index, id }) {
      const locIndex = this.getLocationIndex()
      this.locations[locIndex].properties[key].splice(index, 1)
    },
    updateKeyword({ key, index, data, locId }) {
      const locIndex = this.getLocationIndex()
      this.locations[locIndex].properties[key][index].name = data
    },
    updateVisibility(val) { this.visible = val },
    async updateNotes(tabName) {
      const onLocationTab = tabName === 'location'
      const locID = onLocationTab ? this.selectedLocation.id : null
      const txt = onLocationTab ? this.selectedLocation.properties.locationNote : this.projectNoteField
      await this.postComment(
        {
          author: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
          lpId: this.form.inputs.lpId,
          locationId: locID,
          text: txt
        }
      )
      await this.setNotes(onLocationTab)
    },
    async setNotes(onLocationTab) {
      this.allNotes = await this.getAllNotes(this.form.inputs.lpId)
      if (onLocationTab) {
        this.locationNotes = this.getLocationNotes(this.selectedLocation.id)
        this.selectedLocation.properties.locationNote = ''
      } else {
        this.projectNotes = this.getProjectNotes()
        this.projectNoteField = ''
      }
    },
    getLocationNotes(id) {
      return this.allNotes.filter(note => note.locationId === id)
    },
    getProjectNotes() {
      return this.allNotes.filter(note => note.locationId === null)
    },
    updateAddress(data) {
      const i = this.getLocationIndex()
      for (const prop in data) {
        this.locations[i].properties[prop] = data[prop]
      }
    },
    getLocationIndex() {
      return this.locations.findIndex(loc => loc.id === this.selectedLocation.id)
    },
    loadLocation(payload) {
      this.selectedLocation = this.locations.filter(location => location.id === payload)[0]
      this.locationNotes = this.getLocationNotes(this.selectedLocation.id)
      this.$store.commit('tabindex/set', 0)
    },
    toggleWildcard() {
      const i = this.getLocationIndex()
      const redirects = this.locations[i].properties.redirects
      redirects.selected.forEach((selection) => {
        if (selection.strategy === 'Same Domain') {
          const url = selection.formatted_url
          const rowIndex = redirects.items.findIndex(item => item.formatted_url === url)
          url[url.length - 1] === '$'
            ? redirects.items[rowIndex].formatted_url = url.slice(0, -1)
            : redirects.items[rowIndex].formatted_url = `${url}$`
        }
      })
    },
    onDeleteRedirects() {
      const i = this.getLocationIndex()
      const redirects = this.locations[i].properties.redirects
      redirects.selected.forEach((selection) => {
        const url = selection.current_url
        redirects.items = redirects.items.filter(item => item.current_url !== url)
      })
      redirects.selected = []
    },
    getSelectedLocationIds() {
      return this.locationtbl.selected
        ? this.locationtbl.selected.map(selected => selected.value)
        : null
    },
    onDelete() {
      const locIDs = this.getSelectedLocationIds()
      if (locIDs) {
        locIDs.forEach((locID) => {
          this.locations = this.locations.filter(location => location.id !== locID || null)
          this.selectedLocation = null
          this.$axios.delete(`/api/lp-project/${this.form.inputs.lpId}/${locID}`)
          this.$axios.delete(`/api/comments/?locationId=${locID}`)
          this.locationtbl.items = this.locationtbl.items.filter(location => location.value !== locID || null)
          this.locationtbl.selected = []
        })
      }
    },
    exportLocations() {
      const locIDs = this.getSelectedLocationIds()
      if (locIDs) {
        const selectedLocations = []
        this.locations.forEach((location) => {
          const formattedLoc = {}
          if (locIDs.includes(location.id)) {
            const entries = Object.entries(location.properties)
            const filterVal = this.excludedExportProp()
            formattedLoc.name = location.name
            for (const [key, val] of entries) {
              if (!filterVal.includes(key)) {
                if (this.propertiesToString.includes(key) && val.length > 0) {
                  formattedLoc[key] = val[0].name
                } else {
                  formattedLoc[key] = val
                }
              }
            }
            selectedLocations.push(formattedLoc)
          }
        })
        const csvurl = this.generateCSV(selectedLocations)
        this.downloadCSV(csvurl)
      }
    },
    onRowSelected(items, tblname) {
      if (tblname === 'locationtbl') {
        this[tblname].selected = items
      } else {
        const i = this.locations.findIndex(loc => loc.id === this.selectedLocation.id)
        this.locations[i].properties.redirects.selected = items
      }
    },
    onSave() {
      this.$axios.$put('api/locations', {
        lpId: this.form.inputs.lpId,
        locations: this.locations
      })
      this.$axios.$put(`api/lp-project/${this.form.inputs.lpId}`, {
        selects: this.form.selects
      })
    },
    allStepsComple(locProp) {
      return locProp.stepOneComplete &&
        locProp.stepTwoComplete &&
        locProp.stepThreeComplete &&
        locProp.stepFourComplete
    },
    updateLocationStatus(i) {
      const locProp = this.selectedLocation.properties
      const stepsComplete = this.allStepsComple(locProp)
      if (stepsComplete) {
        this.locations[i].properties.locationComplete = true
        this.locationtbl.items[i].status = true
      } else {
        this.locations[i].properties.locationComplete = false
        this.locationtbl.items[i].status = false
      }
    },
    updatePRLocationStatus(i) {
      const locProp = this.selectedLocation.properties
      this.locationtbl.items[i].prstatus = locProp.prComplete
      this.onSave()
    },
    onUpdate({ key, val, id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      if (key === 'name') {
        this.locations[i][key] = val
      } else {
        this.locations[i].properties[key] = val
      }
      this.updateLocationStatus(i)
      this.updatePRLocationStatus(i)
    },
    updateProjectData({ key, val }) {
      this[key] = val
    },
    updateCell({ key, val, index, col, id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      this.locations[i].properties.redirects.items[index][col] = val
    },
    addRows(val, { id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      this.locations[i].properties.redirects.items.push(...val)
    },
    async loadLocations(locations) {
      const res = await this.$axios.$post('api/locations', {
        lpId: this.form.inputs.lpId,
        locations
      })
      this.locations.push(...res)
      this.locationtbl.items.push(...[
        ...res.map((location) => {
          const { name, properties } = location
          return {
            select: false,
            location: `${name} - ${properties.street_address_1}`,
            status: properties.locationComplete,
            prstatus: properties.prComplete,
            value: location.id
          }
        })
      ])
      this.form.loading = false
      this.showAlert(this.form.csvSuccessMsg, 'success')
    },
    async onUpload() {
      try {
        this.form.loading = true
        const data = await this.parseCSV(this.form.inputs.file)
        const locations = await this.getLocationData(data)
        if (locations[0].name) {
          this.loadLocations(locations)
        } else {
          this.showAlert(this.csvErrMsg, 'danger')
          this.form.loading = false
        }
      } catch (err) {
        this.showAlert(this.form.csvErrMsg, 'danger')
        this.form.loading = false
      }
    }
  }
}
</script>

<style scoped>

.main-with-nav {
    position: fixed;
    top:5rem;
    left: 0;
    right: 0;
    bottom: 30px;
}
.scroll-container {
    overflow-y: scroll;
    height: 100%;
    scroll-behavior: smooth
}
</style>
