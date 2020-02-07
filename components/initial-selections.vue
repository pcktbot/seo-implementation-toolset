<template>
  <b-container fluid>
    <b-alert
      :show="form.showMsg"
      :variant="form.alertvariant"
      @dismissed="form.showMsg = false, form.msg='', form.alertvarianbt"
      dismissible
    >
      {{ form.msg }}
    </b-alert>
    <b-row>
      <b-col
        v-for="select in form.selects"
        :key="select.id"
        cols="4"
        class="mb-4"
      >
        <b-form-select
          :id="select.id"
          :value="select.value"
          :options="select.options"
          @change="onChange(select.id, $event)"
        />
      </b-col>
      <b-col cols="5">
        <b-form-file
          v-model="form.inputs.file"
          accept=".csv"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
        />
      </b-col>
      <b-col>
        <b-form-input
          id="input-1"
          :value="form.inputs.lpId"
          @input="onInput('lpId', $event)"
          placeholder="Enter LP project Id"
          required
        />
      </b-col>
      <b-col>
        <b-btn
          @click="onUpload"
          variant="outline-primary--darken3"
          block
          class="px-4"
        >
          Upload
        </b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    validDropDowns(obj) {
      let val = true
      let i = 0
      const keys = Object.keys(obj)
      while (val && i < keys.length) {
        if (!this.selects[keys[i]].selected) {
          val = false
        }
        i++
      }
      return val
    },
    onChange(key, val) {
      this.$emit('field-update', { key, val })
    },
    onInput(key, val) {
      this.$emit('input-update', { key, val })
    },
    validId() {
      return this.form.inputs.lpId && !isNaN(this.forms.inputs.lpId)
    },
    hasFile() {
      return this.form.inputs.file.length > 0
    },
    onUpload() {
      if (!this.validDropDowns(this.form.selects) || !this.validId()) {
        this.$emit('err-upld',
          'Please ensure vertical, domain strategy and chain branding drop downs have selections. LP field cannot be blank',
          'danger',
          true
        )
      } else {
        this.$emit('upload-data')
      }
    }
  }
}
</script>

<style>

</style>
