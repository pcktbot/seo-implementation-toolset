<template>
  <div>
    <span :id="tooltipID" class="d-inline-block" tabindex="0">
      <b-btn
        :disabled="isDisabled"
        @click="save(saveData.stepUpdateTxt)"
        variant="outline-secondary--darken3"
        class="px-5"
      >
        Save
      </b-btn>
      <b-tooltip :target="saveData.tooltipTargetID" placement="left" variant="secondary">
        complete step to save
      </b-tooltip>
    </span>
  </div>
</template>

<script>
import Locations from '~/mixins/locations'
import Alert from '~/mixins/alert'
export default {
  mixins: [Locations, Alert],
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
    }
  },
  methods: {
    save(key) {
      this.onSave()
      this.onUpdate({ key, val: true })
      this.updateLocationStatus()
      this.showAlert('Saved', 'success')
    }
  }

}
</script>

<style>

</style>
