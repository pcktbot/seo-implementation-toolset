<template>
  <b-form-file
    v-model="form.inputs.file"
    accept=".csv"
    placeholder="Choose file"
    drop-placeholder="Drop file here..."
  />
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
  }
}
</script>

<style>

</style>
