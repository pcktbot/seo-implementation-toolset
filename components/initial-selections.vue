<template>
  <b-container fluid>
    <instructions
      :form="form"
      :toggle="toggle"
    />
    <dropdowns
      v-if="toggle.selected === 'upload'"
      :form="form"
      @field-update="onChange"
    />
    <b-collapse id="collapse-1" v-model="visible">
      <b-row>
        <b-col
          v-if="toggle.selected === 'upload'"
          cols="12"
          md="4"
        >
          <loadfile :form="form" />
        </b-col>
        <b-col :md="getColWidth()" cols="12">
          <lpinput
            :form="form"
            @input-update="onInput"
          />
        </b-col>
        <b-col :md="getColWidth()" cols="12">
          <loadbtn
            :form="form"
            :selected="toggle.selected"
            @upload-data="onUpload"
          />
        </b-col>
      </b-row>
    </b-collapse>
  </b-container>
</template>

<script>
import lpinput from '~/components/init-selections/lpinput'
import loadbtn from '~/components/init-selections/loadbtn'
import dropdowns from '~/components/init-selections/dropdowns'
import loadfile from '~/components/init-selections/loadfile'
import instructions from '~/components/init-selections/instructions'
export default {
  components: {
    lpinput,
    loadbtn,
    dropdowns,
    loadfile,
    instructions
  },
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      file: [],
      toggle: {
        selected: 'upload',
        options: [
          { text: 'New LP Project', value: 'upload' },
          { text: 'Load LP Project', value: 'import' }
        ]
      },
      missingFields: 'All fields must be filled out to continue'
    }
  },
  methods: {
    getColWidth() {
      return this.toggle.selected === 'upload' ? 4 : 6
    },
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
  .alert-dismissible .close {
      padding: .9rem 1.15rem;
  }
</style>
