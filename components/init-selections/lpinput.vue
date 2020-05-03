<template>
  <b-form>
    <b-input
      v-model="lpId"
      :state="validation"
      :disabled="onLpPage"
      @input="setLpId($event)"
      placeholder="Enter 8 digit LP Id"
      required
      type="number"
    />
    <b-form-invalid-feedback :state="validation">
      Your LP ID must be 8 digits long.
    </b-form-invalid-feedback>
    <b-form-valid-feedback :state="validation" class="ml-2" />
  </b-form>
</template>

<script>
export default {
  computed: {
    lpId: {
      get() { return this.$store.getters['initSelects/lpId'] },
      set(val) {
        this.$store.commit('initSelects/SET', { 'lpId': val })
      }
    },
    onLpPage() {
      return !!this.$nuxt._route.params.lpId
    },
    validation() {
      return !!(this.lpId && this.lpId.toString().length === 8)
    }
  },
  methods: {
    setLpId(val) { this.lpId = val }
  }
}
</script>

<style>

</style>
