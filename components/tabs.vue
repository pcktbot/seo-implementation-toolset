<template>
  <div class="d-flex justify-content-start align-items-center mb-0">
    <div v-if="!complete">
      <b-icon icon="x-circle" variant="warning" />
    </div>
    <div v-else>
      <b-icon icon="check-circle" variant="success" />
    </div>
    <!-- SOME COMPLETED INDICATION HERE -->
    {{ text }}
  </div>
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
