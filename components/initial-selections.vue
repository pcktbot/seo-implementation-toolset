<template>
  <b-container fluid>
    <b-alert
      :show="initialSelect.showMsg"
      :variant="initialSelect.alertvariant"
      @dismissed="initialSelect.showMsg=false, initialSelect.msg='',initialSelect.alertvarianbt"
      dismissible
    >
      {{ initialSelect.msg }}
    </b-alert>
    <b-row>
      <b-col
        v-for="select in selects"
        :key="select.selected"
        cols="4"
        class="mb-4"
      >
        <b-form-select
          v-model="select.selected"
          :options="select.options"
          @change="onInput(select.key, select.selected)"
        />
      </b-col>
      <b-col cols="5">
        <b-form-file
          v-model="initialSelect.file"
          accept=".csv"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
        />
      </b-col>
      <b-col>
        <b-form-input
          id="input-1"
          :value="form.lpId"
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
    initialSelect: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      selects: {
        verticals: {
          key: 'vertical',
          selected: null,
          options: [
            { value: null, text: 'Select Vertical' },
            { value: 'mf', text: 'Multi-Family' },
            { value: 'ss', text: 'Self Storage' },
            { value: 'sl', text: 'Senior Living' }
          ]
        },
        domain: {
          key: 'domain',
          selected: null,
          options: [
            { value: null, text: 'Select Domain Strategy' },
            { value: 'multi', text: 'Multi Domain' },
            { value: 'single', text: 'Single Domain' }
          ]
        },
        branding: {
          key: 'branding',
          selected: null,
          options: [
            { value: null, text: 'Select Chain Branding' },
            { value: 'yes', text: 'Yes' },
            { value: 'no', text: 'No' }
          ]
        }
      }
    }
  },
  computed: {
    form: {
      get() {
        return {
          lpId: this.initialSelect.lpId,
          file: this.initialSelect.file,
          showMsg: this.initialSelect.showMsg,
          msg: this.initialSelect.msg,
          alertvariant: this.initialSelect.alertvariant,
          vertical: this.initialSelect.vertical,
          domain: this.initialSelect.domain,
          branding: this.initialSelect.branding
        }
      },
      set(val) {}
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
    onInput(key, val) {
      // eslint-disable-next-line no-console
      console.log(key)
      // eslint-disable-next-line no-console
      console.log(val)
      this.$emit('field-update', { key, val })
    },
    validLPID() {
      return this.initialSelect.lpId && !isNaN(this.initialSelect.lpId)
    },
    hasFile() {
      return this.initialSelect.file.length > 0
    },
    onUpload() {
      if (!this.validDropDowns(this.selects) || !this.validLPID()) {
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
