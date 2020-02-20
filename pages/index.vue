<template>
  <div>
    <g5-nav />
    <b-container fluid class="px-5">
      <b-row>
        <b-col>
          <b-card no-body class="my-5">
            <b-card-header>
              <h3 class="mb-1">
                Step 1: Complete Options Below
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
      <b-row>
        <b-col>
          <b-card no-body>
            <b-card-header>
              <h3>
                Step 2: Select Location
              </h3>
            </b-card-header>
            <b-card-body>
              <b-form-select
                v-model="location.selected"
                :options="location.options"
                @change="loadLocation"
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
import FormStepper from '~/components/form-stepper'
import g5Nav from '~/components/nav'
import initialSelections from '~/components/initial-selections'
export default {
  components: {
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
        msg: '',
        alertvariant: '',
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
      tableheaders: {
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
  methods: {
    loadLocation(payload) {
      this.selectedLocation = this.locations.filter(location => location.id === payload)[0]
    },
    onSave(locationID) {
      // TODO validate save payload
      this.$axios
        .$put('api/locations', {
          lpId: this.form.inputs.lpId,
          locations: this.locations
        })
    },
    onUpdate({ key, val, id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      if (key === 'name') {
        this.locations[i][key] = val
      } else {
        this.locations[i].properties[key] = val
      }
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
    onUpload() {
      try {
        Papa.parse(this.form.inputs.file, {
          header: true,
          complete: (res) => {
            const locations = res.data.map((location) => {
              const { name } = location
              const properties = this.reject(location, ['name'])
              properties.population = null
              properties.uspsvalid = null
              properties.recommended_name = null
              properties.redirects = this.tableheaders
              properties.redirecttext = ''
              properties.redirectstrat = ''
              return { name, properties }
            })
            // this.locations = locations
            // writes parsed csv to database
            this.$axios
              .$post('api/locations', {
                lpId: this.form.inputs.lpId,
                locations
              }).then((res) => {
                // adds location data to front end and fills out location drop down
                this.locations = res
                this.location.options = [
                  { value: null, text: 'Select Location' },
                  ...res.map((location) => {
                    const { name, properties } = location
                    return { value: location.id, text: `${name} - ${properties.street_address_1}` }
                  })
                ]
                // this.setMsgConfig('Your CSV has been successfully imported, please select a location below', 'success', true)
              })
            this.$axios
              .$post('lp-project', {
                lpId: this.form.inputs.lpId,
                selects: this.form.selects
              })
          }
        })
      } catch (err) {
        // this.setMsgConfig('There was an error uploading the csv', 'danger', true)
      }
    }
  }
}
</script>

<style scoped>

</style>
