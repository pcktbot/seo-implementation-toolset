<template>
  <div>
    <h2 class="text-center">
      Step 3: Fill in Client Data
    </h2>
    <b-container class="stepper-container my-5 d-none">
      <b-form
        id="my-form"
        role="form"
        data-toggle="validator"
        accept-charset="utf-8"
      >
      <!-- INSERT STEPPER -->
      </b-form>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      form: state => state.form
    })
  },
  data() {
    return {
      steps: [
        { id: 'name-address', text: 'Name / Address Validation' },
        { id: 'keyword-research', text: 'Keyword Research' },
        { id: 'context', text: 'Context' },
        { id: 'redirects', text: 'Redirects' },
        { id: 'notes', text: 'Notes' }
      ]
    }
  },
  methods: {
    ...mapActions({})
  }
}
</script>

<style>

</style>
