<template>
  <div style="padding: 2rem 3rem; text-align: left;">
    <div class="field">
      <label class="label">Username</label>
      <div class="control">
        <input
          :class="['input', ($v.form.username.$error) ? 'is-danger' : '']"
          v-model="form.username"
          type="text"
          placeholder="Text input"
        >
      </div>
      <p v-if="$v.form.username.$error" class="help is-danger">
        This username is invalid
      </p>
    </div>
    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input :class="['input', ($v.form.demoEmail.$error) ? 'is-danger' : '']" v-model="form.demoEmail" type="text" placeholder="Email input">
      </div>
      <p v-if="$v.form.demoEmail.$error" class="help is-danger">
        This email is invalid
      </p>
    </div>
    <div class="field">
      <label class="label">Message</label>
      <div class="control">
        <textarea :class="['textarea', ($v.form.message.$error) ? 'is-danger' : '']" v-model="form.message" placeholder="Textarea" />
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  props: ['clickedNext', 'currentStep'],
  data () {
    return {
      form: {
        username: '',
        demoEmail: '',
        message: ''
      }
    }
  },
  validations: {
    form: {
      username: {
        required
      },
      demoEmail: {
        required,
        email
      },
      message: {
        required
      }
    }
  },
  watch: {
    $v: {
      handler (val) {
        if (!val.$invalid) {
          this.$emit('can-continue', { value: true, form: this.form })
        } else {
          this.$emit('can-continue', { value: false })
        }
      },
      deep: true
    },
    clickedNext (val) {
      this.$emit('formData', { form: this.form })
      if (val === true) {
        this.$v.form.$touch()
      }
    }
  },
  mounted () {
    if (!this.$v.$invalid) {
      this.$emit('can-continue', { value: true })
    } else {
      this.$emit('can-continue', { value: false })
    }
  }
}

</script>

<style>

</style>
