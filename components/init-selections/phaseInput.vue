<template>
  <b-form>
    <b-input
      v-model="phase"
      :state="validation"
      placeholder="Enter Location/s phase"
      type="number"
    />
    <b-form-invalid-feedback :state="validation">
      Phase must be entered
    </b-form-invalid-feedback>
    <b-form-valid-feedback :state="validation" class="ml-2" />
  </b-form>
</template>

<script>
export default {
  computed: {
    phase: {
      get() { return this.$store.state.initSelects.phase },
      set(val) { this.$store.commit('initSelects/SET', { 'phase': val }) }
    },
    onLpPage() {
      return !!this.$nuxt._route.params.lpId
    },
    validation() {
      return !!(this.phase)
    }
  },
  methods: {}
}
</script>

<style>

</style>
