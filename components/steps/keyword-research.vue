<template>
  <b-container fluid>
    <b-row class="align-items-center pb-2">
      <b-col cols="12" lg="4" xl="2">
        <h3 class="text-left mb-0">
          Keywords
        </h3>
      </b-col>
      <b-col cols="12" lg="8" xl="4">
        <h5 class="text-left mb-0">
          <strong>Negative Keywords:</strong>
          <span style="color: #dc3545">{{ compform.negative_keywords ? compform.negative_keywords : 'N/A' }}</span>
        </h5>
      </b-col>
      <b-col class="text-right pr-1 pl-1" cols="12" lg="4" xl="2">
        <b-btn
          @click="getKeywords(apiProps)"
          variant="outline-secondary--darken3"
          class="mb-1"
          block
        >
          <div class="d-flex justify-content-center">
            Get Keywords
            <b-spinner v-if="loading" class="mt-1 ml-1" small label="Loading..." />
          </div>
        </b-btn>
      </b-col>
      <b-col class="text-right pr-1 pl-1" cols="12" lg="4" xl="2">
        <b-btn
          @click="getPhrases"
          variant="outline-secondary--darken3"
          class="mb-1"
          block
        >
          Get Phrases
        </b-btn>
      </b-col>
      <b-col class="text-right pr-1 pl-1" cols="12" lg="4" xl="2">
        <span :id="displaySaveTip" class="w-100 d-inline-block" tabindex="0">
          <b-btn
            :disabled="!validateStepTwo1"
            @click="onSave('stepTwoComplete')"
            variant="outline-secondary--darken3"
            class="px-4 mb-1"
            block
          >
            {{ saveTxt }}
          </b-btn>
        </span>
        <b-tooltip target="step-two-tip" placement="topleft" variant="secondary">
          complete step to save
        </b-tooltip>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="input in inputs"
        :key="input"
        class="col-12 col-md-6 col-lg-3"
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
        class="align-self-center col-12 col-md-6 col-lg-3"
      >
        <div v-if="form.selects[0].value === 'mf'">
          <b-form-group
            label="PROPERTY FEATURE"
            for="property_feature_1"
            class="pb-0 text-left text-uppercase"
          >
            <b-form-select
              id="property_feature_1"
              :value="pickPropertyVal"
              :options="validation.steptwofields.propertyvalue.options"
              :state="pickPropertyVal !== null"
              @change="onInput('property_feature_1', $event)"
              class="pb-1"
            />
          </b-form-group>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="keyword in keywords"
        :key="keyword"
        class="col-12 col-md-6 col-xl"
      >
        <b-form-group
          :for="`textarea-${keyword}`"
          :label="`${keyword.replace(/_/g,' ').toUpperCase()}`"
          class="pb-0 text-left text-uppercase"
        >
          <b-form-textarea
            :id="`textarea-${keyword}`"
            :placeholder="`Paste your comma seperated ${keyword.replace(/_/g,' ')} here`"
            @input="onInput(keyword, $event)"
            :value="compform[keyword]"
            class="text-left"
            required
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3 class="text-left mb-0 p-0">
          Phrases
        </h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="phrase in phrases"
        :key="phrase"
        class="col-12 col-md"
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
            rows="4"
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
import SaveStep from '~/mixins/savestep'
export default {
  mixins: [PhraseGenerator, Diacritics, SaveStep],
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
      loading: false,
      saveTxt: 'Save',
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
    apiProps() {
      return {
        vertical: this.form.selects[0].value,
        address: this.location.properties.street_address_1,
        class: this.location.properties.class,
        city: this.location.properties.city,
        state: this.location.properties.state,
        zip: this.location.properties.postal_code
      }
    },
    displaySaveTip() {
      return !this.validateStepTwo() ? 'step-two-tip' : 'not-disabled'
    },
    validateStepTwo1() {
      const valid = this.validateStepTwo()
      return valid
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
          api_landmark_keywords: this.location.properties.api_landmark_keywords,
          negative_keywords: this.location.properties.negative_keywords
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
    getKeywords(props) {
      // eslint-disable-next-line no-console
      console.log(props)
      this.loading = true
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
