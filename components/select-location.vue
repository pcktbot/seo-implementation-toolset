<template>
  <b-row>
    <b-col>
      <b-card no-body>
        <b-card-header>
          <h3>Select Location</h3>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col cols="8">
              <b-form-select
                v-model="location.selected"
                :options="location.options"
                @change="loadLocation"
              />
            </b-col>
            <b-col class="text-right" cols="4">
              <b-btn
                v-b-modal.modal-1
                variant="danger"
                class="px-4"
              >
                Delete Location
              </b-btn>
              <b-modal
                id="modal-1"
                @ok="onDelete"
                title="BootstrapVue"
              >
                <p class="my-4">
                  Sure you want to delete this location?
                </p>
              </b-modal>
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
    },
    onDelete() {
      this.$emit('delete-location')
    }
  }
}
</script>

<style>

</style>
