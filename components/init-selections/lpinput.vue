<template>
  <div>
    <b-form v-if="initSelects.toggle.selected === 'upload'">
      <b-input
        v-model="lpId"
        :state="validation"
        :disabled="onLpPage"
        placeholder="Enter 8 digit LP Id"
        required
        type="number"
      />
      <b-form-invalid-feedback :state="validation">
        Your LP ID must be 8 digits long.
      </b-form-invalid-feedback>
      <b-form-valid-feedback :state="validation" class="ml-2" />
    </b-form>
    <vue-multiselect
      v-else
      v-model="selected"
      :options="allLocations.options"
      @input="onLocationSelect"
      placeholder="Search"
      track-by="lpId"
      label="text"
    />
  </div>
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
    },
    onLpPage() {
      return !!this.$nuxt._route.params.lpId
    },
    validation() {
      return !!(this.lpId && this.lpId.toString().length === 8)
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
