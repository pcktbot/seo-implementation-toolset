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
      selects: state => state.initSelects.selects
    })
  },
  methods: {
    ...mapMutations({
      updateSelects: 'initSelects/UPDATE_SELECTS'
    }),
    onChange(key, value) {
      const i = this.selects.findIndex(select => select.id === key)
      this.updateSelects({ val: value, index: i })
    },
    validation(id, index) {
      return !!(this.selects[index].value)
    }
  }
}
</script>

<style>

</style>
