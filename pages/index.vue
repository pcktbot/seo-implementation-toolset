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
              <b-alert
                :show="isError"
                @dismissed="isError=false"
                dismissible
                variant="danger"
              >
                {{ errorMsg }}
              </b-alert>
              <b-alert
                :show="successfulUpload"
                @dismissed="successfulUpload=false"
                dismissible
                variant="success"
              >
                {{ successMsg }}
              </b-alert>
              <b-row>
                <b-col
                  v-for="select in selects"
                  :key="select.selected"
                  cols="4"
                  class="mb-4"
                >
                  <b-form-select
                    v-model="select.selected"
                    :options="select.options"
                  />
                </b-col>
                <b-col cols="5">
                  <b-form-file
                    v-model="file"
                    accept=".csv"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
                  />
                </b-col>
                <b-col>
                  <b-form-input
                    id="input-1"
                    v-model="lpId"
                    required
                    placeholder="Enter LP project Id"
                  />
                </b-col>
                <b-col>
                  <b-btn
                    @click="onUpload"
                    variant="outline-primary--darken3"
                    block
                    class="px-4"
                  >
                    Upload
                  </b-btn>
                </b-col>
              </b-row>
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
            @stepper-updated="onUpdate"
            @step-1-save="stepOneSave"
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
export default {
  components: {
    FormStepper,
    g5Nav
  },
  data () {
    return {
      selectedLocation: null,
      lpId: null,
      file: [],
      isError: false,
      successfulUpload: false,
      successMsg: '',
      errorMsg: '',
      selects: {
        verticals: {
          selected: null,
          options: [
            { value: null, text: 'Select Vertical' },
            { value: 'mf', text: 'Multi-Family' },
            { value: 'ss', text: 'Self Storage' },
            { value: 'sl', text: 'Senior Living' }
          ]
        },
        domain: {
          selected: null,
          options: [
            { value: null, text: 'Select Domain Strategy' },
            { value: 'multi', text: 'Multi Domain' },
            { value: 'single', text: 'Single Domain' }
          ]
        },
        branding: {
          selected: null,
          options: [
            { value: null, text: 'Select Chain Branding' },
            { value: 'yes', text: 'Yes' },
            { value: 'no', text: 'No' }
          ]
        }
      },
      locations: [],
      location: {
        selected: null,
        options: [
          { value: null, text: 'Select Locaiton' },
          { value: 'loc1', text: 'Loc 1' }
        ]
      }
    }
  },
  methods: {
    loadLocation(payload) {
      // eslint-disable-next-line no-console
      console.log(payload)
      this.selectedLocation = this.locations.filter(location => location.id === payload)[0]
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
    validDropDowns(obj) {
      let val = true
      let i = 0
      const keys = Object.keys(obj)
      while (val && i < keys.length) {
        if (!this.selects[keys[i]].selected) {
          val = false
        }
        i++
      }
      return val
    },
    validLPID() {
      return this.lpId && !isNaN(this.lpId)
    },
    hasFile() {
      return this.file.length > 0
    },
    onSave(event) {
      this.$emit('on-save', event)
      // TODO validate save payload
      this.$axios
        .$put('api/locations/update', {
          lpId: this.lpId,
          locations: this.locations
        })
    },
    stepOneSave({ key, val, id }, fields) {
      // eslint-disable-next-line no-console
      console.log(fields)
    },
    onUpdate({ key, val, id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      if (key === 'name') {
        this.locations[i][key] = val
      } else {
        this.locations[i].properties[key] = val
      }
    },
    onUpload() {
      if (!this.validDropDowns(this.selects) || !this.validLPID()) {
        this.errorMsg = 'Please ensure vertical, domain strategy and chain branding drop downs have selections. LP field cannot be blank'
        this.isError = true
      } else {
        try {
          Papa.parse(this.file, {
            header: true,
            complete: (res) => {
              const locations = res.data.map((location) => {
                const { name } = location
                const properties = this.reject(location, ['name'])
                properties.population = null
                properties.uspsvalid = null
                return { name, properties }
              })
              // writes parsed csv to database
              this.$axios
                .$post('api/locations', {
                  lpId: this.lpId,
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
                  this.successMsg = 'Your CSV has been successfully imported, please select a location below'
                  this.successfulUpload = true
                })
            }
          })
        } catch (err) {
          this.errorMsg = 'There was an error uploading the csv'
          this.isError = true
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
