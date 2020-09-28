<template>
  <b-form>
    <b-input
      v-model="lpId"
      :state="validation"
      :disabled="onLpPage"
      placeholder="Enter a Project Id"
      required
    />
    <b-form-invalid-feedback :state="validation">
      Your ID cant be blank
    </b-form-invalid-feedback>
    <b-form-valid-feedback :state="validation" class="ml-2" />
  </b-form>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      initSelects: state => state.initSelects
    }),
    lpId: {
      get() { return this.$store.state.initSelects.lpId },
      set(val) {
        this.$store.commit('initSelects/SET', { 'lpId': val })
      }
    },
    onLpPage() {
      return !!this.$nuxt._route.params.lpId
    },
    validation() {
      return !!this.lpId
    }
  },
  methods: {
  }
}
</script>

<style>

</style>
