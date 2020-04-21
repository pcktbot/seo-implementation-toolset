<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-form-group label="Complete Keyword Research Below">
          <b-form-radio-group
            id="btn-radios-2"
            v-model="selected"
            :options="radioOptions"
            buttons
            button-variant="outline-primary"
            size="md"
            name="radio-btn-outline"
            class="w-75"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-card class="py-0 mb-2">
      <b-row class="align-items-center">
        <b-col cols="12" lg="12" xl="6">
          <h5 class="text-left mb-0">
            <strong>Negative Keywords:</strong>
            <span style="color: #dc3545">{{ compform.negative_keywords ? compform.negative_keywords : 'N/A' }}</span>
          </h5>
        </b-col>
        <b-col class="text-right pr-1 pl-2" cols="12" lg="4" xl="3">
          <b-btn
            @click="getKeywords(apiProps)"
            variant="secondary"
            class="mb-1"
            block
          >
            <div class="d-flex justify-content-center">
              Get Keywords
              <b-spinner v-if="loading" class="mt-1 ml-1" small label="Loading..." />
            </div>
          </b-btn>
        </b-col>
        <b-col class="text-right pr-2 pl-1" cols="12" lg="4" xl="3">
          <b-btn
            @click="getPhrases"
            variant="secondary"
            class="mb-1"
            block
          >
            Get Phrases
          </b-btn>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-for="input in getInputs"
          :key="input"
          class="col-12 col-md"
        >
          <b-form-group
            :id="`input-group-${input}`"
            :label="input.replace(/_/g,' ')"
            :label-for="`input-${input}`"
            class="text-left text-uppercase mb-0"
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
      </b-row>
      <b-row>
        <b-col
          v-for="keyword in getKeywordInputs"
          :key="keyword"
          class="col-12 col-lg"
        >
          <b-form-group
            :for="`textarea-${keyword}`"
            :label="`${keyword.replace(/_/g,' ').toUpperCase()}`"
            class="pb-0 mb-0 text-left text-uppercase"
          >
            <b-form-textarea
              :id="`textarea-${keyword}`"
              :placeholder="`Paste your comma seperated ${keyword.replace(/_/g,' ')} here`"
              @input="onInput(keyword, $event)"
              :value="compform[keyword]"
              class="text-left"
              rows="4"
              required
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-for="phrase in getPhraseInputs"
          :key="phrase"
          class="col-12 col-md"
        >
          <b-form-group
            :for="`textarea-${phrase}`"
            :label="`${phrase.replace(/_/g,' ').toUpperCase()}`"
            class="pb-0 mb-0 text-left text-uppercase"
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
    </b-card>
    <b-row class="align-items-center">
      <b-col class="text-right py-0">
        <save-step
          :isDisabled="!validateStepTwo1"
          :saveData="saveData"
          :tooltipID="displaySaveTip"
          @step-save="onSave"
          @step-update="onInput"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import SaveStep from '~/components/save-step'
import PhraseGenerator from '~/mixins/phrases'
import Diacritics from '~/mixins/diacritics'
export default {
  components: {
    SaveStep
  },
  mixins: [PhraseGenerator, Diacritics],
  props: {
    inputs: {
      type: Object,
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
    }
  },
  data () {
    return {
      saveData: {
        tooltipTargetID: 'step-two-tip',
        stepUpdateTxt: 'stepTwoComplete'
      },
      loading: false,
      saveTxt: 'Save',
      mfRequiredFields: [
        'landmark_1_name',
        'apartment_amenity_1',
        'community_amenity_1'
      ],
      selected: 'neighborhood',
      options: [
        { text: 'Neighborhood', value: 'neighborhood' },
        { text: 'Landmark', value: 'landmark' },
        { text: 'Amenity', value: 'amenity' }
      ]
    }
  },
  computed: {
    getInputs() {
      return this.inputs[this.selected].inputs
    },
    getKeywordInputs() {
      return this.inputs[this.selected].keywords
    },
    getPhraseInputs() {
      return this.inputs[this.selected].phrases
    },
    radioOptions() {
      return this.form.selects[0].value === 'mf' ? this.options : this.options.slice(0, -1)
    },
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
          api_neighborhood_keywords: this.location.properties.api_neighborhood_keywords,
          api_landmark_keywords: this.location.properties.api_landmark_keywords,
          negative_keywords: this.location.properties.negative_keywords
        }
      },
      set(val) {}
    }
  },
  methods: {
    onSave() {
      this.$emit('step-save')
    },
    getFields() {
      return this.form.selects[0].value === 'mf'
        ? this.mfRequiredFields
        : []
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
