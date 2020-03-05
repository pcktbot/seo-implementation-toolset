<template>
  <div>
    <g5-nav />
    <b-container fluid class="px-5">
      <b-row>
        <b-col>
          <b-card no-body class="my-3">
            <b-card-header>
              <h3 class="mb-1">
                Complete Options Below
              </h3>
            </b-card-header>
            <b-card-body class="py-5">
              <initial-selections
                :form="form"
                @upload-data="onUpload"
                @err-upld="setMsgConfig"
                @field-update="updateSelect"
                @input-update="updateInput"
              />
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <location-table
        :locationtbl="locationtbl"
        :selectedLocation="selectedLocation"
        @delete-location="onDelete"
        @select-location="onRowSelected"
        @load-location="loadLocation"
      />
      <b-row no-gutters>
        <b-col cols="12">
          <form-stepper
            v-if="selectedLocation"
            :location="selectedLocation"
            :form="form"
            @stepper-updated="onUpdate"
            @save-step="onSave"
            @add-rows="addRows"
            @cell-update="updateCell"
            @del-row="removeRow"
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
        errLoadMsg: 'Error loading locations, check to ensure the url is using the correct LP ID',
        csvSuccessMsg: 'Your new locations have beeen successfully added, please select a location below',
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
      location: {
        selected: null,
        options: [
          { value: null, text: 'Select Location' }
        ]
      },
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
            sortable: true
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
            key: 'wildcard',
            label: 'Wildcard'
          },
          'remove'
        ],
        items: []
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
      // adds location data to front end and fills out location drop down
      this.locations = res
      // adds data to drop down
      this.location.options = [
        { value: null, text: 'Select Location' },
        ...res.map((location) => {
          const { name, properties } = location
          return { value: location.id, text: `${name} - ${properties.street_address_1}` }
        })
      ]
      // adds data to table
      this.locationtbl.items = [
        ...res.map((location) => {
          const { name, properties } = location
          return { select: false, location: `${name} - ${properties.street_address_1}`, status: properties.locationComplete, value: location.id }
        })
      ]
      this.location.options.length > 1
        ? this.setMsgConfig(this.form.successLoadMsg, 'success', true)
        : this.setMsgConfig(this.form.errLoadMsg, 'danger', true)
    })
  },
  methods: {
    loadLocation(payload) {
      // eslint-disable-next-line no-console
      console.log(payload)
      this.selectedLocation = this.locations.filter(location => location.id === payload)[0]
    },
    onDelete() {
      const locIDs = this.locationtbl.selected
        ? this.locationtbl.selected.map(selected => selected.value)
        : null
      if (locIDs) {
        locIDs.forEach((locID) => {
          this.locationtbl.items = this.locationtbl.items.filter(location => location.value !== locID || null)
          this.locations = this.locations.filter(location => location.id !== locID || null)
          this.selectedLocation = null
          this.locationtbl.selected = []
          this.$axios.delete(`/api/lp-project/${this.form.inputs.lpId}/${locID}`)
        })
      }
    },
    onRowSelected(items) {
      this.locationtbl.selected = items
    },
    onSave() {
      // TODO validate save payload
      this.$axios
        .$put('api/locations', {
          lpId: this.form.inputs.lpId,
          locations: this.locations
        })
    },
    locationComplete() {
      const locProp = this.selectedLocation.properties
      return locProp.stepOneComplete && locProp.stepTwoComplete && locProp.stepThreeComplete
    },
    onUpdate({ key, val, id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      if (key === 'name') {
        this.locations[i][key] = val
      } else {
        this.locations[i].properties[key] = val
      }
      this.locationComplete() ? this.locations[i].properties.locationComplete = true : this.locations[i].properties.locationComplete = false
    },
    updateCell({ key, val, index, col, id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      this.locations[i].properties.redirects.items[index][col] = val
    },
    removeRow({ index, id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      this.locations[i].properties.redirects.items.splice(index, 1)
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
        this.location.options.push(...[
          ...res.map((location) => {
            const { name, properties } = location
            return { value: location.id, text: `${name} - ${properties.street_address_1}` }
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
