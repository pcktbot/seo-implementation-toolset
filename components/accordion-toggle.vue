<template>
  <div class="text-center">
    <b-btn
      id="toggle-btn"
      :class="visible ? null : 'collapsed'"
      @click="visible = !visible"
      aria-controls="collapse-4"
      class="tab-btn px-5"
      variant="secondary"
      size="sm"
      style="padding-top: .1em; padding-bottom: .1em;"
    >
      <b-icon v-if="!visible" icon="chevron-down" style="color: white" />
      <b-icon v-else icon="chevron-up" style="color: white" />
    </b-btn>
  </div>
</template>

<script>
export default {
  computed: {
    visible: {
      get() { return this.$store.state.initSelects.visible },
      set(val) { this.$store.commit('initSelects/SET', { 'visible': val }) }
    }
  }
}
</script>

<style scoped>

</style>
