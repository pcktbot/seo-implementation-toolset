<template>
  <b-form>
    <b-input
      v-model="form.inputs.lpId"
      :state="validation"
      :value="form.inputs.lpId"
      :disabled="onLpPage"
      @input="onInput('lpId', $event)"
      placeholder="Enter 6 digit LP Id"
      required
      type="number"
    />
    <b-form-invalid-feedback :state="validation">
      Your LP ID must be 6 digits long.
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
    onLpPage() {
      return !!this.$nuxt._route.params.lpID
    },
    validation() {
      // eslint-disable-next-line no-console
      console.log(!!(this.form.inputs.lpId && this.form.inputs.lpId.toString().length === 6))
      return !!(this.form.inputs.lpId && this.form.inputs.lpId.toString().length === 6)
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
