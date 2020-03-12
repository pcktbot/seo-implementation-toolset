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
  data() {
    //
  },
  computed: {
    onLpPage() {
      return !!this.$nuxt._route.params.lpID
    },
    validation() {
      return !!(this.form.inputs.lpId && this.form.inputs.lpId.toString().length === 6)
    }
  },
  methods: {
    formatNumber(e) {
      return String(e).substring(0, 4)
    },
    onInput(key, val) {
      this.$emit('input-update', key, val)
    }
  }
}
</script>

<style>

</style>
