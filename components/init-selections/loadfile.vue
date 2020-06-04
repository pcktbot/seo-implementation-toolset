<template>
  <b-form>
    <b-form-file
      v-model="file"
      :state="validation"
      accept=".csv"
      placeholder="Choose CSV file"
      drop-placeholder="Drop file here..."
      block
    />
    <b-form-invalid-feedback :state="validation" class="pl-1">
      Attach File
    </b-form-invalid-feedback>
    <b-form-valid-feedback :state="validation" />
  </b-form>
</template>

<script>
export default {
  computed: {
    file: {
      get() { return this.$store.state.initSelects.file },
      set(val) { this.$store.commit('initSelects/SET', { 'file': val }) }
    },
    validation() {
      return !!(this.file)
    }
  }
}
</script>

<style>

</style>
