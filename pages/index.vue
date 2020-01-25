<template>
  <div>
    <g5Nav />
    <div class="mainBody">
      <h3>Step 1: Complete Options Below</h3>
      <b-row>
        <b-col v-for="select in selects" :key="select.selected">
          <b-form-select
            v-model="select.selected"
            :options="select.options"
          />
        </b-col>
        <b-col>
          <b-form-file
            v-model="file"
            :state="Boolean(file)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          />
        </b-col>
        <b-col>
          <b-form-input
            id="input-1"
            v-model="projectId"
            required
            placeholder="Enter LP project Id"
          />
        </b-col>
        <b-col>
          <b-btn
            @click="upload"
          >
            Upload
          </b-btn>
        </b-col>
      </b-row>
      <h3>Step 2: Select Location</h3>
      <b-row>
        <b-col>
          <b-form-select v-model="location.selected" :options="location.options" @change="loadLocation" />
        </b-col>
      </b-row>
      <!-- <div class="mt-3">Selected: <strong>{{ verticals.selected }}</strong></div> -->
    </div>
    <form-stepper
      v-if="selectedLocation"
      :location="selectedLocation"
    />
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
      projectId: null,
      file: [],
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
      locationData: null,
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
    loadLocation (payload) {
      console.log(payload)
      this.selectedLocation = this.locationData[payload]
    },
    upload () {
      Papa.parse(this.file, {
        header: true,
        complete: (res) => {
          this.location.options = [{ value: null, text: 'Select Location' }, ...res.data.map((location, i) => {
            const { name } = location
            return {
              value: i,
              text: name
            }
          })]
          this.locationData = res.data
        }
      })
    }
  }
}
</script>

<style>
.mainBody {
  padding-top: 5em;
}
</style>
