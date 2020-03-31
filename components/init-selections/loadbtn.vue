<template>
  <b-container class="p-0">
    <b-btn
      v-if="selected === 'upload'"
      :disabled="disabledUpload"
      @click="onUpload"
      variant="outline-primary--darken3"
      block
      class="px-4"
      aria-label
    >
      <div class="d-flex justify-content-center">
        {{ btnText }}
        <b-spinner v-if="form.loading" class="mt-1 ml-5" small label="Loading..." />
      </div>
    </b-btn>
    <b-btn
      v-else
      :disabled="disabled"
      :href="loadLPLink"
      variant="outline-primary--darken3"
      block
      class="px-4"
    >
      Load LP Project
    </b-btn>
  </b-container>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    selected: {
      type: String,
      default() {
        return {}
      }
    }
  },
  computed: {
    btnText() {
      return this.$nuxt._route.params.lpID ? 'Add Locations' : 'Upload'
    },
    loadLPLink() {
      return this.form.inputs.lpId ? `/lp-project/${this.form.inputs.lpId}` : ''
    },
    disabled() {
      return !(this.form.inputs.lpId && this.form.inputs.lpId.toString().length === 8)
    },
    disabledUpload() {
      const values = [this.form.inputs.lpId]
      this.form.selects.forEach(select => values.push(select.value))
      let valid = true
      for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
          valid = false
          break
        }
      }
      return !(valid && this.form.inputs.file && this.form.inputs.lpId.toString().length === 8)
    }
  },
  methods: {
    onUpload() {
      this.$emit('upload-data')
    }
  }
}
</script>

<style>

</style>
