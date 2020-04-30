<template>
  <h5 class="d-flex justify-content-start align-items-center mb-0">
    <div v-if="!complete" class="pr-1">
      <b-icon icon="x-circle" variant="danger" />
    </div>
    <div v-else class="pr-1">
      <b-icon class="heartbeat" icon="check-circle" variant="success" />
    </div>
    <strong>{{ text }}</strong>
  </h5>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default() {
        return ''
      }
    },
    complete: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style>

</style>
