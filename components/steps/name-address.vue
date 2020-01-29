<template>
  <b-container fluid>
    <b-row>
      <b-col
        v-for="input in inputs"
        :key="input"
        cols="4"
      >
        <b-form-group
          :id="`input-group-${input}`"
          :label="input"
          :label-for="`input-${input}`"
          class="text-left text-uppercase"
        >
          <b-form-input
            :id="`input-${input}`"
            :value="form[input]"
            :placeholder="`Enter ${input}`"
            @input="onInput(input, $event)"
            required
          />
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    inputs: {
      type: Array,
      default() {
        return {}
      }
    },
    location: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    form: {
      get() {
        return {
          name: this.location.name,
          street_address_1: this.location.properties.street_address_1,
          city: this.location.properties.city,
          state: this.location.properties.state,
          postal_code: this.location.properties.postal_code,
          country: this.location.properties.country
        }
      },
      set(val) {}
    }
  },
  methods: {
    onSave() {
      this.$emit('step-1-save', {})
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    }
  }
}
</script>

<style>

</style>
