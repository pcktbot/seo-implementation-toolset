<template>
  <div>
    <g5-nav />
    <b-container fluid>
      <b-row class="pt-5 px-5" style="background-color: #F8F8F8">
        <b-col>
          <initial-selections
            :form="form"
            @upload-data="onUpload"
            @field-update="updateSelect"
            @input-update="updateInput"
          />
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
        </b-col>
      </b-row>
      <b-row class="px-5" style="background-color: WhiteSmoke">
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
      <b-row class="px-5 py-3" style="background-color: #F0F0F0">
        <b-col class="px-0">
          <form-stepper
            v-if="selectedLocation && !disabledUpload"
            :location="selectedLocation"
            :form="form"
            :locationNotes="locationNotes"
            @stepper-updated="onUpdate"
            @save-step="onSave"
            @add-rows="addRows"
            @cell-update="updateCell"
            @select-location="onRowSelected"
            @delete-redirects="onDeleteRedirects"
            @toggle-wildcard="toggleWildcard"
            @update-address="updateAddress"
            @submit-note="updateLocationNotes"
          />
        </b-col>
      </b-row>
    </b-container>
    <div class="footer">
      <p />
    </div>
  </div>
</template>

<script>
// import Papa from 'papaparse'
import LocationTable from '~/components/location-table'
import FormStepper from '~/components/form-stepper'
import g5Nav from '~/components/nav'
import initialSelections from '~/components/initial-selections'
import Index from '~/mixins/index'
import CommentsMixin from '~/mixins/comments'

export default {
  components: {
    LocationTable,
    FormStepper,
    g5Nav,
    initialSelections
  },
  mixins: [Index, CommentsMixin],
  data () {
    return {
      comments: [],
      form: {
        inputs: {
          lpId: null,
          file: null
        },
        loading: false,
        alertMsg: '',
        alertvariant: '',
        dismissSecs: 5,
        dismissCountDown: 0,
        successLoadMsg: 'Successfully loaded locations',
        errLoadMsg: 'Error loading location/s, check to ensure the url is using the correct LP ID',
        csvSuccessMsg: 'Your new location/s have beeen successfully added, please select a location below',
        csvErrMsg: 'There was an error uploading the csv',
        selects: [
          {
            id: 'vertical',
            value: null,
            options: [
              { value: null, text: 'Select Vertical' },
              { value: 'mf', text: 'Multi-Family' },
              { value: 'ss', text: 'Self Storage' },
              { value: 'sl', text: 'Senior Living' }
            ]
          },
          {
            id: 'domain',
            value: null,
            options: [
              { value: null, text: 'Select Domain Strategy' },
              { value: 'multi', text: 'Multi Domain' },
              { value: 'single', text: 'Single Domain' }
            ]
          },
          {
            id: 'branding',
            value: null,
            options: [
              { value: null, text: 'Select Chain Branding' },
              { value: 'yes', text: 'Yes' },
              { value: 'no', text: 'No' }
            ]
          }
        ]
      },
      selectedLocation: null,
      locationNotes: [],
      projectNotes: [],
      locations: [],
      locationtbl: {
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
  async created() {
    const { lpID } = this.$nuxt._route.params
    // loads initial selections
    await this.$axios.$get(`api/lp-project/${lpID}`).then((res) => {
      this.form.inputs.lpId = res[0].lpId
      this.form.selects.forEach((select) => {
        select.value = res[0][select.id]
      })
    })
    this.projectNotes = await this.getAllNotes(lpID)
    const res = await this.$axios.$get(`api/locations/${lpID}`)
    // adds location data to front end and fills out location table
    this.locations = res
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
  },
  methods: {
    async updateLocationNotes() {
      await this.postComment(
        {
          author: 'Colin McCullough', // need to add the author
          lpId: this.selectedLocation.lpId,
          locationId: this.selectedLocation.id,
          text: this.selectedLocation.properties.locationNote
        }
      )
      this.projectNotes = await this.getAllNotes(this.selectedLocation.lpId)
      this.locationNotes = this.getLocationNotes()
    },
    getLocationNotes() {
      return this.projectNotes.filter(note => note.locationId === this.selectedLocation.id)
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
      this.locationNotes = this.projectNotes.filter(note => note.locationId === payload)
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
          // need to delete comments
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
                formattedLoc[key] = val
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
      // TODO validate save payload
      this.$axios
        .$put('api/locations', {
          lpId: this.form.inputs.lpId,
          locations: this.locations
        })
    },
    updateLocationStatus(i) {
      const locProp = this.selectedLocation.properties
      if (locProp.stepOneComplete && locProp.stepTwoComplete && locProp.stepThreeComplete) {
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
          return { select: false, location: `${name} - ${properties.street_address_1}`, status: properties.locationComplete, value: location.id }
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
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: var(--primary);
  color: white;
  text-align: center;
}
</style>
