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
      type: Object,
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
          address: this.location.street_address_1,
          city: this.location.city,
          state: this.location.state,
          zip: this.location.postal_code,
          country: this.location.country
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
