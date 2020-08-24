<template>
  <b-row>
    <b-col
      v-for="(select, index) in selects"
      :key="select.id"
      class="mb-2 p"
      cols="12"
      md="4"
    >
      <b-form>
        <b-form-select
          :id="select.id"
          :state="validation(select.id, index)"
          :value="select.value"
          :options="select.options"
          @change="onChange(select.id, $event)"
        />
        <b-form-invalid-feedback :state="validation(select.id, index)">
          Select option
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validation(select.id, index)" />
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({
      selects: state => state.initSelects.selects,
      locations: state => state.locations.locations
    })
  },
  methods: {
    ...mapMutations({
      updateSelects: 'initSelects/UPDATE_SELECTS',
      updateLocationProp: 'locations/UPDATE_LOCATION_PROP'
    }),
    onChange(key, value) {
      const i = this.selects.findIndex(select => select.id === key)
      this.updateSelects({ val: value, index: i })
      // updates secure domain val to True for Multi Domain and '' for Single
      if (key === 'domain' && this.locations.length > 0 && value) {
        this.locations.forEach((location, locIdx) => {
          const val = value === 'multi' ? 'TRUE' : ''
          this.updateLocationProp({ locIdx, key: 'secure_domain', val })
        })
      }
    },
    validation(id, index) {
      return !!(this.selects[index].value)
    }
  }
}
</script>

<style>

</style>
