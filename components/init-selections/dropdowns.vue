<template>
  <b-row>
    <b-col
      v-for="(select, index) in form.selects"
      :key="select.id"
      cols="4"
      class="mb-4"
    >
      <b-form>
        <b-form-select
          :id="select.id"
          :state="validation(select.id, index)"
          :value="select.value"
          :options="select.options"
          @change="onChange(select.id, $event)"
        />
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    onChange(key, val) {
      this.$emit('field-update', key, val)
    },
    validation(id, index) {
      return !!(this.form.selects[index].value)
    }

  }
}
</script>

<style>

</style>
