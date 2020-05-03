<template>
  <b-container fluid>
    <instructions />
    <dropdowns v-if="initSelects.toggle.selected === 'upload'" />
    <b-collapse id="collapse-1" v-model="visible">
      <b-row>
        <b-col
          v-if="initSelects.toggle.selected === 'upload'"
          cols="12"
          md="4"
        >
          <loadfile />
          <!-- :form="form" /> -->
        </b-col>
        <b-col :md="getColWidth()" cols="12">
          <lpinput />
          <!-- :form="form"
            @input-update="onInput"
          /> -->
        </b-col>
        <b-col :md="getColWidth()" cols="12">
          <loadbtn />
          <!-- :form="form"
            :selected="toggle.selected"
            @upload-data="onUpload"
          /> -->
        </b-col>
      </b-row>
    </b-collapse>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
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
  data() {
    return {}
  },
  computed: {
    ...mapState({
      initSelects: state => state.initSelects
    }),
    visible: {
      get() { return this.$store.getters['initSelects/visible'] },
      set(val) { this.$store.commit('initSelects/SET', { 'visible': val }) }
    }
  },
  methods: {
    getColWidth() {
      return this.initSelects.toggle.selected === 'upload' ? 4 : 6
    }
    // onChange(key, val) {
    //   this.$emit('field-update', { key, val })
    // },
    // onInput(key, val) {
    //   this.$emit('input-update', { key, val })
    // },
    // onUpload() {
    //   this.$emit('upload-data')
    // }
  }
}
</script>

<style>
  .alert-dismissible .close {
      padding: .9rem 1.15rem;
  }
</style>
