<template>
  <div class="text-center">
    <b-btn
      id="toggle-btn"
      :class="isVisible ? null : 'collapsed'"
      @click="isVisible = !isVisible"
      aria-controls="collapse-4"
      class="tab-btn px-5"
      variant="secondary"
      size="sm"
      style="padding-top: .1em; padding-bottom: .1em;"
    >
      <b-icon v-if="!isVisible" icon="chevron-down" style="color: white" />
      <b-icon v-else icon="chevron-up" style="color: white" />
    </b-btn>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update-visibility', val)
      }
    }
  }
}
</script>

<style scoped>

</style>
