<template>
  <div>
    <span :id="tooltipID" class="d-inline-block" tabindex="0">
      <b-btn
        :disabled="isDisabled"
        @click="onSave(saveData.stepUpdateTxt)"
        variant="outline-secondary--darken3"
        class="px-5"
      >
        {{ saveTxt }}
      </b-btn>
      <b-tooltip :target="saveData.tooltipTargetID" placement="left" variant="secondary">
        complete step to save
      </b-tooltip>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    isDisabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    saveData: {
      type: Object,
      default() {
        return {}
      }
    },
    tooltipID: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data () {
    return {
      saveTxt: 'Save'
    }
  },
  methods: {
    onSave(key) {
      this.saveTxt = 'Saved!'
      this.$emit('step-save')
      // eslint-disable-next-line no-return-assign
      setTimeout(() => this.saveTxt = 'Save', 3000)
      this.$emit('step-update', key, true)
    }
  }

}
</script>

<style>

</style>
