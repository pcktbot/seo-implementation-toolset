<template>
  <b-row>
    <b-col>
      <b-card no-body>
        <b-card-header>
          <h3>Select Location</h3>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col cols="10">
              <b-form-select
                v-model="location.selected"
                :options="location.options"
                @change="loadLocation"
              />
            </b-col>
            <b-col class="text-right" cols="2">
              <b-btn
                @click="onDelete"
                variant="danger"
                class="px-4"
              >
                Delete Location
              </b-btn>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    location: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    loadLocation(payload) {
      this.$emit('load-location', payload)
    }
  }
}
</script>

<style>

</style>
