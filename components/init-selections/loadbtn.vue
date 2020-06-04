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
import Upload from '~/mixins/upload'
import Alert from '~/mixins/alert'
export default {
  mixins: [Upload, Alert],
  computed: {
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
    }
  },
  methods: {
    onUpload() {
      this.toggle.selected === 'upload'
        ? this.upload()
        : window.open(`/lp-project/${this.initSelects.lpId}`, '_self')
    }
  }
}
</script>

<style>

</style>
