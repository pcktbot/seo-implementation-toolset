<template>
  <b-row>
    <b-col
      v-for="select in form.selects"
      :key="select.id"
      cols="4"
      class="mb-4"
    >
      <b-form-select
        :id="select.id"
        :value="select.value"
        :options="select.options"
        @change="onChange(select.id, $event)"
      />
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
    }
  }
}
</script>

<style>

</style>
