<template>
  <b-card no-body class="my-5 py-2">
    <b-card-header class="text-left">
      <h4 class="mb-0">
        Step 3: Fill in Client Data
      </h4>
    </b-card-header>
    <b-tabs card content-class="my-5">
      <b-tab>
        <template v-slot:title>
          <!-- SOME COMPLETED INDICATION HERE -->
          Name / Adress Validation
        </template>
        <name-address
          :inputs="validation.fields"
          :location="location"
          @step-update="onUpdate"
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
import NameAddress from '~/components/name-address'
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
          'address',
          'city',
          'state',
          'zip',
          'country'
        ]
      }
    }
  },
  methods: {
    onUpdate(data) {
      this.$emit('stepper-updated', data)
    }
  }
}
</script>

<style scoped>

</style>>

</style>
