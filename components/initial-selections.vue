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
      <b-col class="text-center mb-3">
        <b-form-group>
          <b-form-radio-group
            id="btn-radios-2"
            v-model="selected"
            :options="options"
            buttons
            button-variant="outline-primary"
            size="lg"
            name="radio-btn-outline"
          />
        </b-form-group>
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
    <b-row v-else>
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
  methods: {
    onChange(key, val) {
      this.$emit('field-update', { key, val })
    },
    onInput(key, val) {
      this.$emit('input-update', { key, val })
    },
    onUpload() {
      this.$emit('upload-data')
    }
  }
}
</script>

<style>

</style>
