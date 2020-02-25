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
            button-variant="outline-primary"
            size="md"
            name="radio-btn-outline"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col class="text-center mb-3">
        <p>To Add Locations, first select a file and Click Add Locations</p>
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

</style>
