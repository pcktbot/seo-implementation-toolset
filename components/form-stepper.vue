<template>
  <div>
    <h2 class="text-center">
      Step 3: Fill in Client Data
    </h2>
    <b-container>
      <horizontal-stepper
        :steps="demoSteps"
        @completed-step="completeStep"
        @active-step="isStepActive"
        @stepper-finished="alert"
      />
    </b-container>
  </div>
</template>

<script>
import HorizontalStepper from 'vue-stepper'
// This components will have the content for each stepper step.
import StepOne from './StepOne.vue'
import StepTwo from './StepTwo.vue'

export default {
  components: {
    HorizontalStepper
  },
  data () {
    return {
      demoSteps: [
        {
          icon: 'mail',
          name: 'first',
          title: 'Sample title 1',
          subtitle: 'Subtitle sample',
          component: StepOne,
          completed: false

        },
        {
          icon: 'report_problem',
          name: 'second',
          title: 'Sample title 2',
          subtitle: 'Subtitle sample',
          component: StepTwo,
          completed: false
        }
      ]
    }
  },
  methods: {
    // Executed when @completed-step event is triggered
    completeStep (payload) {
      this.demoSteps.forEach((step) => {
        console.log({ payload })
        if (step.name === payload.name) {
          step.completed = true
        }
      })
    },
    // Executed when @active-step event is triggered
    isStepActive (payload) {
      this.demoSteps.forEach((step) => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false
          }
        }
      })
    },
    // Executed when @stepper-finished event is triggered
    alert (payload) {
      alert('end')
    }
  }
}
</script>

<style>

</style>
