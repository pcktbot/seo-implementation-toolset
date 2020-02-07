<template>
  <b-container fluid>
    <b-row class="align-items-center pb-2">
      <b-col class="text-left">
        <b-alert
          :show="hasMsg"
          :variant="alertvariant"
          @dismissed="hasMsg=false, alertvariant='', msg=''"
          dismissible
        >
          {{ msg }}
        </b-alert>
      </b-col>
      <b-col class="text-right">
        <b-btn
          @click="onSave"
          variant="outline-secondary--darken3"
          class="px-4"
        >
          Save
        </b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="input in inputs"
        :key="input"
        cols="4"
      >
        <b-form-group
          :id="`input-group-${input}`"
          :label="input"
          :label-for="`input-${input}`"
          class="text-left text-uppercase"
        >
          <b-form-input
            :id="`input-${input}`"
            :value="form[input]"
            :placeholder="`Enter ${input}`"
            @input="onInput(input, $event)"
            required
          />
        </b-form-group>
      </b-col>
    </b-row>
    <h3 class="text-center">
      Keywords
    </h3>
    <b-row>
      <b-col
        v-for="keyword in keywords"
        :key="keyword"
        :cols="adjustColWidth"
      >
        <b-form-textarea
          :id="`textarea-${keyword}`"
          :label="keyword"
          :label-for="`input-${keyword}`"
          :placeholder="`Paste your comma seperated ${keyword} Keywords here`"
          class="text-left"
          required
        >
          <!-- NEEDS VALUE BELOW TO PULL IN -->
        </b-form-textarea>
      </b-col>
    </b-row>
    <h3 class="text-center">
      Phrases
    </h3>
    <b-row>
      <b-col
        v-for="phrase in phrases"
        :key="phrase"
        :cols="adjustColWidth"
      >
        <b-form-textarea
          :id="`textarea-${phrase}`"
          :label="phrase"
          :label-for="`input-${phrase}`"
          :placeholder="`${phrase} Phrases will auto-populate here after running generate keywords`"
          class="text-left"
          required
        >
          <!-- NEEDS VALUE BELOW TO PULL IN -->
        </b-form-textarea>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    inputs: {
      type: Array,
      default() {
        return {}
      }
    },
    keywords: {
      type: Array,
      default() {
        return {}
      }
    },
    phrases: {
      type: Array,
      default() {
        return {}
      }
    },
    location: {
      type: Object,
      default() {
        return {}
      },
      initialSelect: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  },
  data () {
    return {
      hasMsg: false,
      msg: '',
      alertvariant: ''
    }
  },
  computed: {
    form: {
      adjustColWidth() {
        return this.initialSelect.vertical === 'mf' ? 4 : 6
      },
      get() {
        return {
          neighborhood: this.location.properties.neighborhood,
          neighborhood_2: this.location.properties.neighborhood_2,
          landmark_1_name: this.location.properties.landmark_1_name,
          apartment_amenity_1: this.location.properties.apartment_amenity_1,
          community_amenity_1: this.location.properties.community_amenity_1
        }
      },
      set(val) {}
    }
  },
  methods: {
    validateStepOne() {
      let valid = true
      for (const prop in this.form) {
        if (this.form[prop] === '' || this.form[prop] === null) {
          valid = false
          break
        }
      }
      return valid
    },
    showMsg(msg) {
      this.msg = msg
      this.alertvariant = 'danger'
      this.hasMsg = true
    },
    onSave() {
      this.hasMsg = false
      const validFields = this.validateStepOne()
      if (validFields) {
        this.$emit('step-1-save', { id: this.location.id })
      } else {
        this.showMsg('Please ensure all fields are filled out')
        this.$emit('update-step-status', 'stepOneComplete', false)
      }
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    }
  }
}
</script>

<style>

</style>
