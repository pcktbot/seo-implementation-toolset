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
          <b-spinner v-if="initSelects.loading" class="mt-1 ml-5" small label="Loading..." />
        </div>
      </b-btn>
      <b-tooltip target="upload-tip" placement="top" variant="secondary">
        complete fields
      </b-tooltip>
    </span>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import Upload from '~/mixins/upload'
import Alert from '~/mixins/alert'
export default {
  mixins: [Upload, Alert],
  computed: {
    ...mapState({
      initSelects: state => state.initSelects,
      toggle: state => state.initSelects.toggle
    }),
    onProjectPage() {
      return !!this.$nuxt._route.params.lpID
    },
    btnText() {
      let btnTxt = ''
      if (this.toggle.selected === 'upload') {
        btnTxt = this.$nuxt._route.params.lpID ? 'Add Locations' : 'Upload'
      } else {
        btnTxt = 'Load LP Project'
      }
      return btnTxt
    },
    disabledUpload() {
      let valid
      if (this.toggle.selected === 'upload') {
        valid = !this.validateIntitialSelections()
      } else {
        valid = !(this.validateLPID())
      }
      return valid
    },
    uploadTip() {
      let val = 'not-disabled'
      if ((this.toggle.selected === 'upload' && !this.validateIntitialSelections()) || (this.toggle.selected === 'import' && !this.validateLPID())) {
        val = 'upload-tip'
      }
      return val
    }
  },
  methods: {
    onUpload() {
      this.toggle.selected === 'upload'
        ? this.upload()
        : window.open(`/lp-project/${this.initSelects.lpId}`, '_self')
    },
    validateIntitialSelections() {
      const values = [this.initSelects.lpId]
      this.initSelects.selects.forEach(select => values.push(select.value))
      let valid = true
      for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
          valid = false
          break
        }
      }
      return (valid && this.initSelects.file && this.initSelects.lpId.toString().length === 8)
    },
    validateLPID() {
      return this.initSelects.lpId && this.initSelects.lpId.toString().length === 8
    }

  }
}
</script>

<style>

</style>
