<template>
  <b-container>
    <b-row v-if="!onLpPage">
      <b-col class="text-center mb-3">
        <b-form-group>
          <b-form-radio-group
            id="btn-radios-2"
            v-model="toggle.selected"
            :options="toggle.options"
            buttons
            button-variant="outline-secondary"
            size="md"
            name="radio-btn-outline"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col class="text-center">
        <h4>Add Locations</h4>
      </b-col>
    </b-row>
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
    toggle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    onLpPage() {
      return !!this.$nuxt._route.params.lpID
    }
  }
}
</script>

<style>
.btn-outline-secondary:hover {
  border-color:#a1b5be;
  background-color:#a1b5be;
}
</style>
