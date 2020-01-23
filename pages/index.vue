<template>
  <div>
    <g5Nav />
    <b-container fluid>
      Content
      <form-stepper />
      <b-row>
        <b-col v-for="select in selects" :key="select.selected">
          <b-form-select v-model="select.selected" :options="select.options" />
        </b-col>
      </b-row>
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
      }
    }
  }
}
</script>

<style>

</style>
