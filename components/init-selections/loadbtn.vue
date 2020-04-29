<template>
  <b-container class="p-0">
    <span :id="uploadTip" class="d-inline-block w-100" tabindex="0">
      <b-btn
        :disabled="disabledUpload"
        @click="onUpload"
        variant="secondary"
        block
        class="px-4"
        aria-label
      >
        <div class="d-flex justify-content-center">
          {{ btnText }}
          <b-spinner v-if="form.loading" class="mt-1 ml-5" small label="Loading..." />
        </div>
      </b-btn>
      <b-tooltip target="upload-tip" placement="top" variant="secondary">
        complete fields
      </b-tooltip>
    </span>
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
      let btnTxt = ''
      if (this.selected === 'upload') {
        btnTxt = this.$nuxt._route.params.lpID ? 'Add Locations' : 'Upload'
      } else {
        btnTxt = 'Load LP Project'
      }
      return btnTxt
    },
    disabledUpload() {
      let valid
      if (this.selected === 'upload') {
        valid = !this.validateIntitialSelections()
      } else {
        valid = !(this.validateLPID())
      }
      return valid
    },
    uploadTip() {
      let val = 'not-disabled'
      if ((this.selected === 'upload' && !this.validateIntitialSelections()) || (this.selected === 'import' && !this.validateLPID())) {
        val = 'upload-tip'
      }
      return val
    }
  },
  methods: {
    onUpload() {
      this.selected === 'upload'
        ? this.$emit('upload-data')
        : window.open(`/lp-project/${this.form.inputs.lpId}`, '_self')
    },
    validateIntitialSelections() {
      const values = [this.form.inputs.lpId]
      this.form.selects.forEach(select => values.push(select.value))
      let valid = true
      for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
          valid = false
          break
        }
      }
      return (valid && this.form.inputs.file && this.form.inputs.lpId.toString().length === 8)
    },
    validateLPID() {
      return this.form.inputs.lpId && this.form.inputs.lpId.toString().length === 8
    }

  }
}
</script>

<style>

</style>
