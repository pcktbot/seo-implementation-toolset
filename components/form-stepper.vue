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
          <b-col v-for="input in validation.fields" :key="input" cols="4">
            <b-form-group :id="`input-group-${input}`" :label="input" :label-for="`input-${input}`">
              <b-form-input
                :id="`input-${input}`"
                :value="form[input]"
                :placeholder="`Enter ${input}`"
                @input="update(input, form[input])"
                required
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
  data () {
    return {
      validation: {
        fields: [
          'name',
          'address',
          'city',
          'state',
          'zip',
          'country'
        ]
      }
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
