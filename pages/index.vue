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
                :initialSelect="initialSelect"
                @upload-data="onUpload"
                @err-upld="setMsgConfig"
                @field-update="updateField"
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
            :initialSelect="initialSelect"
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
import initialSelections from '~/components/initial-selections'
export default {
  components: {
    FormStepper,
    g5Nav,
    initialSelections
  },
  data () {
    return {
      initialSelect: {
        lpId: null,
        file: [],
        showMsg: false,
        msg: '',
        alertvariant: '',
        vertical: '',
        domain: '',
        branding: ''
      },
      selectedLocation: null,
      locations: [],
      location: {
        selected: null,
        options: [
          { value: null, text: 'Select Locaiton' }
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
    onSave(event) {
      this.$emit('on-save', event)
      // TODO validate save payload
      this.$axios
        .$put('api/locations/update', {
          lpId: this.initialSelect.lpId,
          locations: this.locations
        })
    },
    stepOneSave({ key, val, id }, fields) {

    },
    onUpdate({ key, val, id }) {
      const i = this.locations.findIndex(loc => loc.id === id)
      if (key === 'name') {
        this.locations[i][key] = val
      } else {
        this.locations[i].properties[key] = val
      }
    },
    updateField({ key, val }) {
      this.initialSelect[key] = val
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
      this.initialSelect.msg = msg
      this.initialSelect.alertvariant = variant
      this.initialSelect.showMsg = msgOn
    },
    onUpload() {
      try {
        Papa.parse(this.initialSelect.file, {
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
                lpId: this.initialSelect.lpId,
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
                this.setMsgConfig('Your CSV has been successfully imported, please select a location below', 'success', true)
              })
          }
        })
      } catch (err) {
        this.setMsgConfig('There was an error uploading the csv', 'danger', true)
      }
    }
  }
}
</script>

<style scoped>

</style>
