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
    <b-row v-if="!onLpPage">
      <b-col class="text-center mb-3">
        <b-form-group>
          <b-form-radio-group
            id="btn-radios-2"
            v-model="selected"
            :options="options"
            buttons
            button-variant="outline-primary"
            size="md"
            name="radio-btn-outline"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col class="text-center mb-3">
        <p>To Add Locations, first select a file and Click Add Locations</p>
      </b-col>
    </b-row>
    <b-row v-if="selected === 'upload'">
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
          :disabled="onLpPage"
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
          <div class="d-flex justify-content-center">
            {{ btnText }}
            <b-spinner v-if="form.loading" class="mt-1 ml-5" small label="Loading..." />
          </div>
        </b-btn>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col>
        <b-form-input
          id="input-1"
          :value="form.inputs.lpId"
          @input="onInput('lpId', $event)"
          placeholder="Enter LP project Id"
          required
          type="number"
        />
      </b-col>
      <b-col>
        <b-btn
          :disabled="disabled"
          :href="loadLPLink"
          variant="outline-primary--darken3"
          block
          class="px-4"
        >
          Load LP Project Upload
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
  data() {
    return {
      file: [],
      selected: 'upload',
      options: [
        { text: 'New LP Project', value: 'upload' },
        { text: 'Load LP Project', value: 'import' }
      ]
    }
  },
  computed: {
    btnText() {
      return this.$nuxt._route.params.lpID ? 'Add Locations' : 'Upload'
    },
    onLpPage() {
      return !!this.$nuxt._route.params.lpID
    },
    loadLPLink() {
      return this.form.inputs.lpId ? `/lp-project/${this.form.inputs.lpId}` : ''
    },
    getLPLink() {
      return this.validateFields() ? `/lp-project/${this.form.inputs.lpId}` : ''
    },
    disabled() {
      // need to verify length of LP Input
      return !this.form.inputs.lpId
    }
  },
  methods: {
    validateFields() {
      const values = [this.form.inputs.lpId]
      this.form.selects.forEach(select => values.push(select.value))
      let valid = true
      for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
          valid = false
          break
        }
      }
      return !!(valid && this.form.inputs.file)
    },
    onChange(key, val) {
      this.$emit('field-update', { key, val })
    },
    onInput(key, val) {
      this.$emit('input-update', { key, val })
    },
    onUpload() {
      if (this.validateFields()) {
        this.$emit('upload-data')
      } else {
        this.$emit('err-upld', 'All fields must be filled out to continue', 'danger', true)
      }
    }
  }
}
</script>

<style>

</style>
