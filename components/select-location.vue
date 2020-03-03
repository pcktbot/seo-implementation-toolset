<template>
  <b-row>
    <b-col>
      <b-card no-body>
        <b-card-header>
          <h3>Select Location</h3>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col cols="6">
              <b-form-select
                v-model="location.selected"
                :options="location.options"
                @change="loadLocation"
              />
            </b-col>
            <b-col class="text-left" cols="3">
              <div v-if="incompleteLocation">
                <b-icon icon="x-circle" variant="warning" />
              </div>
              <div v-else>
                <b-icon icon="check-circle" variant="success" />
              </div>
            </b-col>
            <b-col class="text-right" cols="3">
              <b-btn
                v-b-modal.modal-1
                variant="danger"
                class="px-4"
              >
                Delete
              </b-btn>
              <b-modal
                id="modal-1"
                @ok="onDelete"
                title="Delete Location"
              >
                <p class="my-4">
                  {{ msg }}
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
    },
    selectedLocation: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    msg() {
      return this.location.selected
        ? 'Are you sure you want to delete this location? This is permanent..' : 'Please select a location to delete'
    },
    // this needs work
    incompleteLocation() {
      let val = true
      if (this.location.selected) {
        if (this.selectedLocation) {
          val = false
        }
      }
      return val
    }
  },
  methods: {
    loadLocation(payload) {
      this.$emit('load-location', payload)
    },
    onDelete() {
      if (this.location.selected) this.$emit('delete-location')
    }
  }
}
</script>

<style>

</style>
