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
        cols="3"
      >
        <b-form-group
          :id="`input-group-${input}`"
          :label="input.replace(/_/g,' ')"
          :label-for="`input-${input}`"
          class="text-left text-uppercase"
        >
          <b-form-input
            :id="`input-${input}`"
            :value="compform[input]"
            :placeholder="`Enter ${input.replace(/_/g,' ')}`"
            @input="onInput(input, $event)"
            required
          />
        </b-form-group>
      </b-col>
      <b-col
        cols="3"
        class="align-self-center mb-4"
      >
        <div v-if="form.selects[0].value === 'mf'">
          <b-form-group
            label="PROPERTY FEATURE"
            for="property_feature_1"
            class="text-left text-uppercase"
          >
            <b-form-select
              id="property_feature_1"
              :value="pickPropertyVal"
              :options="validation.steptwofields.propertyvalue.options"
              @change="onInput('property_feature_1', $event)"
            />
          </b-form-group>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="4" />
      <b-col
        cols="4"
      >
        <h3 class="text-center">
          Keywords
        </h3>
      </b-col>
      <b-col
        class="text-right"
        cols="4"
      >
        <b-btn
          @click="getKeywords"
          variant="outline-secondary--darken3"
          class="px-4"
        >
          Get Keywords / Phrases
        </b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="keyword in keywords"
        :key="keyword"
        :cols="adjustColWidth"
      >
        <b-form-group
          :for="`textarea-${keyword}`"
          :label="`PASTE ${keyword.replace(/_/g,' ').toUpperCase()} HERE`"
          class="pb-0 text-left text-uppercase"
        >
          <b-form-textarea
            :id="`textarea-${keyword}`"
            :placeholder="`Paste your comma seperated ${keyword.replace(/_/g,' ')} Keywords here`"
            @input="onInput(keyword, $event)"
            :value="compform[keyword]"
            class="text-left"
            required
          />
        </b-form-group>
      </b-col>
    </b-row>
    <h3 class="text-center mt-3">
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
          :placeholder="`${phrase.replace(/_/g,' ')} will auto-populate here after running generate keywords`"
          @input="onInput(phrase, $event)"
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
      }
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    validation: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      hasMsg: false,
      msg: '',
      alertvariant: '',
      mfRequiredFields: [
        'landmark_1_name',
        'apartment_amenity_1',
        'community_amenity_1',
        'floor_plans',
        'custom_slug',
        'property_feature_1'
      ],
      otherRequiredFields: [
        'custom_slug'
      ]
    }
  },
  computed: {
    adjustColWidth() {
      return this.form.selects[0].value === 'mf' ? 4 : 6
    },
    pickPropertyVal() {
      const propertyFeatureVal = this.location.properties.property_feature_1
      return propertyFeatureVal || null
    },
    compform: {
      get() {
        return {
          neighborhood: this.location.properties.neighborhood,
          neighborhood_2: this.location.properties.neighborhood_2,
          landmark_1_name: this.location.properties.landmark_1_name,
          apartment_amenity_1: this.location.properties.apartment_amenity_1,
          community_amenity_1: this.location.properties.community_amenity_1,
          neighborhood_keywords: this.location.properties.neighborhood_keywords,
          landmark_keywords: this.location.properties.landmark_keywords,
          amenity_keywords: this.location.properties.amenity_keywords,
          floor_plans: this.location.properties.floor_plans,
          property_feature_1: this.location.properties.property_feature_1,
          custom_slug: this.location.properties.custom_slug
        }
      },
      set(val) {}
    }
  },
  methods: {
    getFields() {
      return this.form.selects[0].value === 'mf'
        ? this.mfRequiredFields
        : this.otherRequiredFields
    },
    validateStepTwo() {
      let valid = true
      const reqFields = this.getFields()
      for (const index in reqFields) {
        const field = this.compform[reqFields[index]]
        if (field === '' || field === null) {
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
      const val = this.validateStepTwo()
      const key = 'stepTwoComplete'
      if (val) {
        this.$emit('step-save')
      } else {
        this.showMsg('Please ensure all fields are filled out')
      }
      this.$emit('step-update', { key, val, id: this.location.id })
    },
    getKeywords() {
      // needs to send vertical, address to back end to call Google Places API
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    }
  }
}
</script>

<style>

</style>
