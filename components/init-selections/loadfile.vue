<template>
  <b-form-file
    v-model="form.inputs.file"
    accept=".csv"
    placeholder="Choose a file or drop it here..."
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
