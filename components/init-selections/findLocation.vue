<template>
  <vue-multiselect
    v-model="selected"
    :options="allLocations.options"
    @input="onLocationSelect"
    placeholder="Search"
    track-by="lpId"
    label="text"
  />
</template>

<script>
import { mapState } from 'vuex'
import VueMultiselect from 'vue-multiselect'
export default {
  components: {
    VueMultiselect
  },
  data() {
    return {
      selected: null
    }
  },
  computed: {
    ...mapState({
      initSelects: state => state.initSelects,
      allLocations: state => state.allLocations
    }),
    lpId: {
      get() { return this.$store.state.initSelects.lpId },
      set(val) {
        this.$store.commit('initSelects/SET', { 'lpId': val })
      }
    }
  },
  methods: {
    onLocationSelect(evt) {
      this.lpId = typeof evt === 'object' && evt !== null
        ? evt.value
        : evt
    }
  }
}
</script>

<style>

</style>
