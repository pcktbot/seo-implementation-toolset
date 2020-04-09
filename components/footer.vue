<template>
  <div class="footer">
    <b-row>
      <b-col class="text-left ml-4">
        <p class="m-1">
          SEO
        </p>
      </b-col>
      <b-col class="text-right mr-4">
        <b-link v-b-modal.feedback-modal style="color: white;">
          Submit Feedback
        </b-link>
      </b-col>
    </b-row>
    <submit-feedback />
  </div>
</template>

<script>
import SubmitFeedback from '~/components/modals/submit-feedback'
export default {
  components: {
    SubmitFeedback
  }
}
</script>

<style scoped>

</style>
