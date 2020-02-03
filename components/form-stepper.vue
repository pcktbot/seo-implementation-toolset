/* eslint-disable no-console */
<template>
  <b-card no-body class="my-5 py-2">
    <b-card-header class="text-left">
      <h4 class="mb-0">
        Step 3: Fill in Client Data
      </h4>
    </b-card-header>
    <b-tabs card content-class="my-2">
      <b-tab>
        <template v-slot:title>
          <!-- SOME COMPLETED INDICATION HERE -->
          Name / Adress Validation
        </template>
        <name-address
          :inputs="validation.fields"
          :location="location"
          :uspsvalid="uspsvalid"
          @step-update="onUpdate"
          @step-1-save="saveStepOne"
        />
      </b-tab>
      <b-tab title="Keyword Research">
        <p>I'm the second tab</p>
      </b-tab>
      <b-tab title="Context">
        <p>I'm the second tab</p>
      </b-tab>
      <b-tab title="Redirects">
        <p>I'm the second tab</p>
      </b-tab>
      <b-tab title="Notes">
        <p>I'm the second tab</p>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import NameAddress from '~/components/steps/name-address'
export default {
  components: {
    NameAddress
  },
  props: {
    location: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      validation: {
        fields: [
          'name',
          'street_address_1',
          'city',
          'state',
          'postal_code',
          'country',
          'population'
        ]
      },
      uspsvalid: {
        selected: null,
        options: [
          { value: null, text: 'Is Location Adress USPS Verified?' },
          { value: true, text: 'Yes - USPS Verified' },
          { value: false, text: 'No - Not USPS Verified' }
        ]
      }
    }
  },
  methods: {
    onUpdate(data) {
      this.$emit('stepper-updated', data)
    },
    saveStepOne(data) {
      const valFieldKeys = this.validation.fields.slice(1, this.validation.fields.length - 1)
      this.$emit('step-1-save', data, valFieldKeys)
    }
  }
}
</script>

<style scoped>

</style>
