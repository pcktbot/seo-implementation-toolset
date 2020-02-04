<template>
  <b-container fluid>
    <b-row>
      <b-alert
        :show="isError"
        @dismissed="isError=false"
        dismissible
        variant="danger"
      >
        {{ errorMsg }}
      </b-alert>
    </b-row>
    <b-row class="pb-2 pl-3">
      <b-btn
        @click="onSave"
        variant="outline-secondary--darken3"
        class="px-4"
      >
        Save
      </b-btn>
    </b-row>
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
      <b-col
        cols="4"
        class="align-self-center pt-3"
      >
        <b-form-select
          :value="form.uspsvalid"
          :options="uspsvalid.options"
          @change="onUsps('uspsvalid', $event)"
        />
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
    },
    uspsvalid: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      isError: false,
      errorMsg: ''
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
          country: this.location.properties.country,
          population: this.location.properties.population,
          uspsvalid: this.location.properties.uspsvalid
        }
      },
      set(val) {}
    }
  },
  methods: {
    updateErr() {
      this.errorMsg = false
    },
    validateStepOne() {
      let valid = true
      for (const prop in this.form) {
        if (this.form[prop] === '' || this.form[prop] === null) {
          valid = false
          break
        }
      }
      return valid
    },
    showErr(msg) {
      this.errorMsg = msg
      this.isError = true
    },
    onSave() {
      const validFields = this.validateStepOne()
      validFields
        ? this.$emit('step-1-save', { id: this.location.id })
        : this.showErr('Please ensure all fields are filled out')
    },
    onUsps(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    }
  }
}
</script>

<style>

</style>
