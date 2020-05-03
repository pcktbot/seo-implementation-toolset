<template>
  <b-container>
    <b-row v-if="!onLpPage">
      <b-col class="text-center mb-3">
        <b-form-group>
          <b-form-radio-group
            id="btn-radios-2"
            v-model="toggleVal"
            :options="toggle.options"
            buttons
            button-variant="outline-primary"
            size="md"
            name="radio-btn-outline"
            class="w-75"
          />
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      toggle: state => state.initSelects.toggle
    }),
    toggleVal: {
      get() { return this.$store.getters['initSelects/selectedToggle'] },
      set(val) { this.$store.commit('initSelects/UPDATE_TOGGLE', val) }
    },
    onLpPage() {
      return !!this.$nuxt._route.params.lpID
    }
  },
  methods: {

  }
}
</script>

<style>
.btn-outline-primary:hover {
  border-color:#9ea7b3;
  background-color:#9ea7b3;
}
</style>
