<template>
  <div>
    <h2 class="text-center">
      Step 3: Fill in Client Data
      <b-tabs content-class="mt-3">
        <b-tab title="Name / Adress Validation" active>
          <b-row>
            <b-col>
              <b-form-group id="input-group-1" label="Name:" label-for="input-1">
                <b-form-input
                  id="input-1"
                  v-model="validation.name"
                  required
                  placeholder="Enter name"
                />
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="input-group-2" label="Address:" label-for="input-2">
                <b-form-input
                  id="input-2"
                  v-model="validation.address"
                  required
                  placeholder="Enter address"
                />
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="input-group-3" label="City:" label-for="input-3">
                <b-form-input
                  id="input-3"
                  v-model="validation.city"
                  required
                  placeholder="Enter City"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group id="input-group-4" label="State:" label-for="input-4">
                <b-form-input
                  id="input-4"
                  v-model="validation.state"
                  required
                  placeholder="Enter state"
                />
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="input-group-5" label="Zip:" label-for="input-5">
                <b-form-input
                  id="input-5"
                  v-model="validation.zip"
                  required
                  placeholder="Enter Zip"
                />
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="input-group-6" label="Country:" label-for="input-6">
                <b-form-input
                  id="input-6"
                  v-model="validation.country"
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
    </h2>
  </div>
</template>

<script>

export default {
  data () {
    return {
      validation: {
        name: null,
        address: null,
        city: null,
        state: null,
        zip: null,
        country: null
      }
    }
  },
  methods: {}
}
</script>

<style>

</style>
