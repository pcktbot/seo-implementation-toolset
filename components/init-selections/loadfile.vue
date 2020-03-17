<template>
  <b-form>
    <b-form-file
      v-model="form.inputs.file"
      :state="validation"
      accept=".csv"
      placeholder="Choose file"
      drop-placeholder="Drop file here..."
    />
    <b-form-invalid-feedback :state="validation">
      Attach File
    </b-form-invalid-feedback>
    <b-form-valid-feedback :state="validation" />
  </b-form>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    validation() {
      return !!(this.form.inputs.file)
    }
  }
}
</script>

<style>

</style>
