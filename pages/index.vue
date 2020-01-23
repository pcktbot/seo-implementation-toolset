<template>
  <div>
    <g5Nav />
    <b-container class="mainBody">
      <h3> Step 1: Complete Options Below</h3>
      <b-row>
        <b-col v-for="select in selects" :key="select.selected">
          <b-form-select v-model="select.selected" :options="select.options" />
        </b-col>
      </b-row>
      <h3>Step 2: Select Location</h3>
      <b-row>
        <b-col>
          <b-form-select v-model="location.selected" :options="location.options" />
        </b-col>
      </b-row>
      <form-stepper />
      <!-- <div class="mt-3">Selected: <strong>{{ verticals.selected }}</strong></div> -->
    </b-container>
  </div>
</template>

<script>
import FormStepper from '~/components/form-stepper'
import g5Nav from '~/components/nav'
export default {
  components: {
    FormStepper,
    g5Nav
  },
  data () {
    return {
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
      location: {
        selected: null,
        options: [
          { value: null, text: 'Select Locaiton' },
          { value: 'loc1', text: 'Loc 1' }
        ]
      }
    }
  }
}
</script>

<style>
.container.mainBody {
  padding-top: 5em;
}
</style>
