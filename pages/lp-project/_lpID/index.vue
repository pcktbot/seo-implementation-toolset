<template>
  <div>
    <g5-nav />
    <b-container fluid class="px-5">
      <b-row>
        <b-col>
          <b-card no-body class="my-3">
            <b-card-body class="pt-3 pb-2">
              <initial-selections
                :form="form"
                @upload-data="onUpload"
                @err-upld="setMsgConfig"
                @field-update="updateSelect"
                @input-update="updateInput"
              />
              <location-table
                :locationtbl="locationtbl"
                :selectedLocation="selectedLocation"
                @delete-location="onDelete"
                @select-location="onRowSelected"
                @load-location="loadLocation"
              />
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <b-row no-gutters>
        <b-col cols="12">
          <form-stepper
            v-if="selectedLocation"
            :location="selectedLocation"
            :form="form"
            :redirecttbl="redirecttbl"
            @stepper-updated="onUpdate"
            @save-step="onSave"
            @add-rows="addRows"
            @cell-update="updateCell"
            @select-location="onRowSelected"
            @delete-redirects="onDeleteRedirects"
            @toggle-wildcard="toggleWildcard"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Papa from 'papaparse'
import LocationTable from '~/components/location-table'
import FormStepper from '~/components/form-stepper'
import g5Nav from '~/components/nav'
import initialSelections from '~/components/initial-selections'
export default {
  components: {
    LocationTable,
    FormStepper,
    g5Nav,
    initialSelections
  },
  data () {
    return {
      form: {
        inputs: {
          lpId: null,
          file: []
        },
        showMsg: false,
        loading: false,
        msg: '',
        alertvariant: '',
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
          }
        ],
        items: [],
        selectMode: 'multi',
        selected: []
      },
      redirecttbl: {
        fields: [
          {
            key: 'strategy',
            label: 'Strategy'
          },
          {
            key: 'current_url',
            label: 'Current URL',
            sortable: true
          },
          {
            key: 'formatted_url',
            label: 'Formatted URL',
            sortable: true
          },
          {
            key: 'select',
            label: 'Select'
          }
        ],
        items: [],
        selected: []
      }
    }
  },
  computed: {
    getAddPropFields() {
      return {
        population: null,
        uspsvalid: null,
        recommended_name: null,
        redirects: this.redirecttbl,
        redirecttext: '',
        redirectstrat: '',
        stepOneComplete: false,
        stepTwoComplete: false,
        stepThreeComplete: false,
        stepFourComplete: false,
        locationComplete: false
      }
    }
  },
  created() {
    const { lpID } = this.$nuxt._route.params
    // loads selections
    this.$axios.$get(`api/lp-project/${lpID}`).then((res) => {
      this.form.inputs.lpId = res[0].lpId
      this.form.selects.forEach((select) => {
        select.value = res[0][select.id]
      })
    })
    this.$axios.$get(`api/locations/${lpID}`).then((res) => {
      // adds location data to front end and fills out location table
      this.locations = res
      // adds data to table
      this.locationtbl.items = [
        ...res.map((location) => {
          const { name, properties } = location
          return { select: false, location: `${name} - ${properties.street_address_1}`, status: properties.locationComplete, value: location.id }
        })
      ]
      this.locationtbl.items.length > 1
        ? this.setMsgConfig(this.form.successLoadMsg, 'success', true)
        : this.setMsgConfig(this.form.errLoadMsg, 'danger', true)
    })
  },
  methods: {
    getLocationIndex() {
      return this.locations.findIndex(loc => loc.id === this.selectedLocation.id)
    },
    loadLocation(payload) {
      this.selectedLocation = this.locations.filter(location => location.id === payload)[0]
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
      const selectedRedirects = this.locations[i].properties.redirects.selected
      selectedRedirects.forEach((selection) => {
        const url = selection.current_url
        this.locations[i].properties.redirects.items = this.locations[i].properties.redirects.items.filter(item => item.current_url !== url)
      })
      this.locations[i].properties.redirects.selected = []
    },
    onDelete() {
      const locIDs = this.locationtbl.selected
        ? this.locationtbl.selected.map(selected => selected.value)
        : null
      if (locIDs) {
        locIDs.forEach((locID) => {
          this.locations = this.locations.filter(location => location.id !== locID || null)
          this.selectedLocation = null
          this.$axios.delete(`/api/lp-project/${this.form.inputs.lpId}/${locID}`)
          this.locationtbl.items = this.locationtbl.items.filter(location => location.value !== locID || null)
          this.locationtbl.selected = []
        })
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
    onUpdate({ key, val, id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      if (key === 'name') {
        this.locations[i][key] = val
      } else {
        this.locations[i].properties[key] = val
      }
      this.updateLocationStatus(i)
    },
    updateCell({ key, val, index, col, id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      this.locations[i].properties.redirects.items[index][col] = val
    },
    addRows(val, { id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      this.locations[i].properties.redirects.items.push(...val)
    },
    updateSelect({ key, val }) {
      const i = this.form.selects.findIndex(select => select.id === key)
      this.form.selects[i].value = val
    },
    updateInput({ key, val }) {
      (key === 'file')
        ? this.form.inputs[key] = [val]
        : this.form.inputs[key] = val
    },
    reject(obj, keys) {
      const vkeys = Object.keys(obj)
        .filter(k => !keys.includes(k))
      return this.pick(obj, vkeys)
    },
    pick(obj, keys) {
      return keys.map(k => k in obj ? { [k]: obj[k] } : {})
        .reduce((res, o) => Object.assign(res, o), {})
    },
    setMsgConfig(msg, variant, msgOn) {
      this.form.msg = msg
      this.form.alertvariant = variant
      this.form.showMsg = msgOn
    },
    loadLocations(locations) {
      this.$axios.$post('api/locations', {
        lpId: this.form.inputs.lpId,
        locations
      }).then((res) => {
        // adds location data to front end and fills out location drop down
        this.locations.push(...res)
        this.locationtbl.items.push(...[
          ...res.map((location) => {
            const { name, properties } = location
            return { select: false, location: `${name} - ${properties.street_address_1}`, status: properties.locationComplete, value: location.id }
          })
        ])
        this.form.loading = false
        this.setMsgConfig(this.form.csvSuccessMsg, 'success', true)
      })
    },
    onUpload() {
      try {
        this.form.loading = true
        Papa.parse(this.form.inputs.file, {
          header: true,
          complete: (res) => {
            const locations = res.data.map((location) => {
              const { name } = location
              const properties = this.reject(location, ['name'])
              for (const prop in this.getAddPropFields) {
                properties[prop] = this.getAddPropFields[prop]
              }
              return { name, properties }
            }).filter(location => location.name)
            if (locations[0].name) {
              this.loadLocations(locations)
            } else {
              this.setMsgConfig(this.csvErrMsg, 'danger', true)
              this.form.loading = false
            }
          }
        })
      } catch (err) {
        this.setMsgConfig(this.form.csvErrMsg, 'danger', true)
        this.form.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
