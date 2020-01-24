<template>
  <b-card no-body class="mx-4 my-5 py-2">
    <b-card-header class="text-left">
      <h2>
        Step 3: Fill in Client Data
      </h2>
    </b-card-header>
    <b-tabs card content-class="my-5">
      <b-tab title="Name / Adress Validation" active>
        <b-row>
          <b-col cols="4">
            <b-form-group id="input-group-1" label="Name:" label-for="input-1">
              <b-form-input
                id="input-1"
                :value="form.name"
                @input="update('name', form.name)"
                required
                placeholder="Enter name"
              />
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group id="input-group-2" label="Address:" label-for="input-2">
              <b-form-input
                id="input-2"
                :value="form.address"
                @input="update('address', form.address)"
                required
                placeholder="Enter address"
              />
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group id="input-group-3" label="City:" label-for="input-3">
              <b-form-input
                id="input-3"
                v-model="form.city"
                required
                placeholder="Enter City"
              />
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group id="input-group-4" label="State:" label-for="input-4">
              <b-form-input
                id="input-4"
                v-model="form.state"
                required
                placeholder="Enter state"
              />
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group id="input-group-5" label="Zip:" label-for="input-5">
              <b-form-input
                id="input-5"
                v-model="form.zip"
                required
                placeholder="Enter Zip"
              />
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group id="input-group-6" label="Country:" label-for="input-6">
              <b-form-input
                id="input-6"
                v-model="form.country"
                required
                placeholder="Enter Country"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab title="Keyword Research">
        <p>I'm the second tab</p>
      </b-tab>
      <b-tab title="Context">
        <p>I'm the second tab</p>
      </b-tab>
      <b-tab title="Redirects">
        <p>I'm the second tab</p>
      </b-tab>
      <b-tab title="Notes">
        <p>I'm the second tab</p>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>

export default {
  props: {
    location: {
      type: Object
    }
  },
  computed: {
    form: {
      get () {
        return {
          name: this.location.name,
          address: this.location.address,
          city: this.location.city,
          state: this.location.state,
          zip: this.location.zip,
          country: this.location.country
        }
      },
      set (val) {}
    }
  },
  methods: {
    update (key, val) {
      this.$emit('update', key, val)
    }
  }
}
</script>

<style>

</style>
