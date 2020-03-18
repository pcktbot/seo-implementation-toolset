<template>
  <b-container fluid>
    <b-row class="align-items-center pb-2">
      <b-col
        cols="6"
      >
        <h3 class="text-left mb-0">
          Keywords
        </h3>
      </b-col>
      <b-col class="text-right">
        <b-btn
          @click="getKeywords"
          variant="outline-secondary--darken3"
          class="px-4"
        >
          <div class="d-flex justify-content-center">
            Get Keywords
            <b-spinner v-if="loading" class="mt-1 ml-1" small label="Loading..." />
          </div>
        </b-btn>
        <b-btn
          @click="getPhrases"
          variant="outline-secondary--darken3"
          class="px-4"
        >
          Get Phrases
        </b-btn>
        <b-btn
          :disabled="!validateStepTwo1"
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
            :state="validateField(input)"
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
              :state="pickPropertyVal !== null"
              @change="onInput('property_feature_1', $event)"
            />
          </b-form-group>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="keyword in keywords"
        :key="keyword"
      >
        <b-form-group
          :for="`textarea-${keyword}`"
          :label="`${keyword.replace(/_/g,' ').toUpperCase()}`"
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
    <h3 class="text-left mt-2">
      Phrases
    </h3>
    <b-row>
      <b-col
        v-for="phrase in phrases"
        :key="phrase"
        :cols="adjustColWidth"
      >
        <b-form-group
          :for="`textarea-${phrase}`"
          :label="`${phrase.replace(/_/g,' ').toUpperCase()}`"
          class="pb-0 text-left text-uppercase"
        >
          <b-form-textarea
            :id="`textarea-${phrase}`"
            :placeholder="`${phrase.replace(/_/g,' ')} will auto-populate here after running generate phrases`"
            :value="location.properties[phrase]"
            @input="onInput(phrase, $event)"
            class="text-left"
            required
          />
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PhraseGenerator from '~/mixins/phrases'
import Diacritics from '~/mixins/diacritics'
export default {
  mixins: [PhraseGenerator, Diacritics],
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
      loading: false,
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
      ],
      apiProps: {
        vertical: this.form.selects[0].value,
        address: this.location.properties.street_address_1,
        class: this.location.properties.class,
        city: this.location.properties.city,
        state: this.location.properties.state,
        zip: this.location.properties.postal_code
      }
    }
  },
  computed: {
    validateStepTwo1() {
      const valid = this.validateStepTwo()
      return valid
    },
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
          custom_slug: this.location.properties.custom_slug,
          api_neighborhood_keywords: this.location.properties.api_neighborhood_keywords,
          api_landmark_keywords: this.location.properties.api_landmark_keywords
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
    validateField(field) {
      let valid = null
      const reqFields = this.getFields()
      if (reqFields.includes(field)) {
        const val = this.location.properties[field]
        if (val === '' || val === null) {
          valid = false
        } else {
          valid = true
        }
      }
      return valid
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
      this.loading = true
      const props = this.apiProps
      const neighborhoodKeywords = []
      const landmarkKeywords = []
      this.$axios.$put('/placesapi/placesRequest', { props })
        .then((res) => {
          const { type1, type2 } = res
          for (const type in type1) {
            type1[type].forEach(place => neighborhoodKeywords.push(this.formatName(place)))
          }
          for (const type in type2) {
            type2[type].forEach(place => landmarkKeywords.push(this.formatName(place)))
          }
          this.$emit('step-update', { key: 'api_neighborhood_keywords', val: neighborhoodKeywords.toString(), id: this.location.id })
          this.$emit('step-update', { key: 'api_landmark_keywords', val: landmarkKeywords.toString(), id: this.location.id })
          this.loading = false
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err)
          this.loading = false
        })
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    },
    splitMapFilterTrim(data1, data2) {
      return data1.split(',')
        .concat(data2.split(','))
        .map(item => item.trim())
        .filter(item => item)
    },
    getKeywordsObj() {
      // eslint-disable-next-line camelcase
      const { api_neighborhood_keywords, neighborhood_keywords, api_landmark_keywords, landmark_keywords } = this.location.properties
      return {
        neighborhood_phrases: this.splitMapFilterTrim(api_neighborhood_keywords, neighborhood_keywords),
        landmark_phrases: this.splitMapFilterTrim(api_landmark_keywords, landmark_keywords),
        amenity_phrases: this.form.selects[0].value === 'mf' ? this.compform.amenity_keywords.split(',').map(item => item.trim()).filter(item => item) : []
      }
    },
    getPhrases() {
      const keywords = this.getKeywordsObj()
      const keyVal = Object.entries(keywords)
      const phrases = { neighborhood_phrases: [], landmark_phrases: [], amenity_phrases: [] }
      for (const [key, arr] of keyVal) {
        arr.forEach((keyword) => {
          phrases[key].push(this.getPhrase(key, keyword))
        })
      }
      if (this.form.selects[0].value !== 'mf') delete phrases.amenity_phrases
      const phraseKeyVal = Object.entries(phrases)
      for (const [prop, phrase] of phraseKeyVal) {
        this.$emit('step-update', { key: prop, val: phrase.toString().replace(/\s\s+/g, ' ').trim(), id: this.location.id })
      }
    },
    formatName(name) {
      return this.removeDiacritics(name)
        .replace(/[^0-9a-zA-Z']+|\s+|']|Helipad 1|Helipad 2|Helipad|Heliport/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    }
  }
}
</script>

<style>

</style>
