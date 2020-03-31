<template>
  <b-form>
    <b-input
      v-model="form.inputs.lpId"
      :state="validation"
      :value="form.inputs.lpId"
      :disabled="onLpPage"
      @input="onInput('lpId', $event)"
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
      return !!(this.form.inputs.lpId && this.form.inputs.lpId.toString().length === 8)
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
