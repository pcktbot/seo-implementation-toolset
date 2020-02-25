<template>
  <b-form-input
    id="input-1"
    :value="form.inputs.lpId"
    :disabled="onLpPage"
    @input="onInput('lpId', $event)"
    placeholder="Enter LP project Id"
    required
    type="number"
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
  },
  computed: {
    onLpPage() {
      return !!this.$nuxt._route.params.lpID
    }
  },
  methods: {
    onInput(key, val) {
      this.$emit('input-update', key, val)
    }
  }
}
</script>

<style>

</style>
