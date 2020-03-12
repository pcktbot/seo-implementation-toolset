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
            type1[type].forEach(place => neighborhoodKeywords.push(place))
          }
          for (const type in type2) {
            type2[type].forEach(place => landmarkKeywords.push(place))
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
    getPhrase(type, value) {
      const vertical = this.form.selects[0].value
      const city = this.location.properties.city
      const state = this.location.properties.state
      const phrases = {
        mf: {
          neighborhood_phrases: `${value} apartments, ${value} ${city} apartments, ${value} ${city} ${state} apartments,
            ${value} apartments in ${city}, ${value} apartments in ${city} ${state}, apartments in ${value},
            apartments in ${value} ${city}, apartments in ${value} ${city} ${state}, apartments ${value},
            apartments ${value} ${city}, apartments ${value} ${city} ${state}, apartments ${city} in ${value},
            apartments ${city} ${state} in ${value}, ${city} apartments in ${value}, ${city} apartments near ${value},
            ${city} ${state} apartments in ${value}, ${city} ${state} apartments near ${value}, apartments near ${value},
            apartments near ${value} ${city}, apartments near ${value} ${city} ${state}, ${value} apartments near me,
            ${value} ${city} apartments near me, ${value} ${city} ${state} apartments near me, ${value} apartments for rent near me,
            ${value} apartments for rent, ${value} ${city} apartments for rent, ${value} ${city} ${state} apartments for rent,
            ${value} apartments for rent in ${city}, ${value} apartments for rent in ${city} ${state}, apartments for rent in ${value},
            apartments for rent in ${value} ${city}, apartments for rent in ${value} ${city} ${state}, apartments for rent ${value},
            apartments for rent ${value} ${city}, apartments for rent ${value} ${city} ${state}, apartments for rent ${city} in ${value},
            ${city} apartments for rent in ${value}, ${city} apartments for rent near ${value}, apartments for rent near ${value},
            apartments for rent near ${value} ${city}, ${value} apartment building, ${value} ${city} apartment building,
            ${value} ${city} ${state} apartment building, ${value} apartment building in ${city}, ${value} apartment building in ${city} ${state},
            apartment building in ${value}, apartment building in ${value} ${city}, apartment building in ${value} ${city} ${state},
            apartment building ${value}, apartment building ${value} ${city}, apartment building ${value} ${city} ${state},
            apartment building ${city} in ${value}, apartment building ${city} ${state} in ${value}, ${city} apartment building in ${value},
            ${city} apartment building near ${value}, ${city} ${state} apartment building in ${value}, ${city} ${state} apartment building near ${value},
            apartment building near ${value}, apartment building near ${value} ${city}, apartment building near ${value} ${city} ${state},
            ${value} apartment building near me, ${value} ${city} apartment building near me, ${value} apartment building for rent,
            ${value} ${city} apartment building for rent, apartment building for rent in ${value}, apartment building for rent ${value},
            apartment building for rent ${value} ${city}, apartment building for rent near ${value}, ${value} apartment complexes,
            ${value} ${city} apartment complexes, ${value} ${city} ${state} apartment complexes, ${value} apartment complexes in ${city},
            ${value} apartment complexes in ${city} ${state}, apartment complexes in ${value}, apartment complexes in ${value} ${city},
            apartment complexes in ${value} ${city} ${state}, apartment complexes ${value}, apartment complexes ${value} ${city},
            apartment complexes ${value} ${city} ${state}, apartment complexes ${city} in ${value}, apartment complexes ${city} ${state} in ${value},
            ${city} apartment complexes in ${value}, ${city} apartment complexes near ${value}, ${city} ${state} apartment complexes in ${value},
            ${city} ${state} apartment complexes near ${value}, apartment complexes near ${value}, apartment complexes near ${value} ${city},
            apartment complexes near ${value} ${city} ${state}, ${value} apartment complexes near me, ${value} ${city} apartment complexes near me,
            ${value} apartment complexes for rent, ${value} ${city} apartment complexes for rent, apartment complexes for rent in ${value},
            apartment complexes for rent ${value}, apartment complexes for rent ${value} ${city}, apartment complexes for rent near ${value},
            ${value} apartment homes, ${value} ${city} apartment homes, ${value} ${city} ${state} apartment homes, ${value} apartment homes in ${city},
            ${value} apartment homes in ${city} ${state}, apartment homes in ${value}, apartment homes in ${value} ${city},
            apartment homes in ${value} ${city} ${state}, apartment homes ${value}, apartment homes ${value} ${city}, apartment homes ${value} ${city} ${state},
            apartment homes ${city} in ${value}, apartment homes ${city} ${state} in ${value}, ${city} apartment homes in ${value},
            ${city} apartment homes near ${value}, ${city} ${state} apartment homes in ${value}, ${city} ${state} apartment homes near ${value},
            apartment homes near ${value}, apartment homes near ${value} ${city}, apartment homes near ${value} ${city} ${state},
            ${value} apartment homes near me, ${value} ${city} apartment homes near me, ${value} apartment homes for rent, ${value} ${city} apartment homes for rent,
            apartment homes for rent in ${value}, apartment homes for rent ${value}, apartment homes for rent ${value} ${city}, apartment homes for rent near ${value}`,
          landmark_phrases: `apartments near ${value}, apartments near ${value}, ${city} apartments near ${value}, apartments in ${city} near ${value}, 
            ${city} ${state} apartments near ${value}, apartments in ${city} ${state} near ${value}, apartments near ${value} in ${city}, 
            apartments near ${value} in ${city} ${state}, apartments for rent near ${value}`,
          amenity_phrases: `apartments with ${value}, ${city} apartments with ${value}, ${city} ${state} apartments with ${value}, apartments in ${city} with ${value}, 
            apartments in ${city} ${state} with ${value}, apartments with ${value} in ${city}, apartments with ${value} in ${city} ${state}, 
            apartments for rent with ${value}, ${city} apartments for rent with ${value}`
        },
        ss: {
          neighborhood_phrases: `Nearest storage facility in ${value} ${city}, Nearest storage facility in ${value}, Self storage facilities near ${value} ${city}, 
            Self storage facilities near ${value}, ${city} self storage facilities near ${value}, Storage facilities near ${value} ${city} ${state}, 
            Storage facilities near ${value} ${city}, Storage facilities near ${value}, ${city} ${state} storage facilities near ${value}, 
            ${city} storage facilities near ${value}, Storage facility rental in ${value} ${city}, Storage facility rental in ${value}, 
            ${city} storage facility rental in ${value}, ${value} storage facility rental in ${city}, ${value} storage facility rental, 
            ${value} ${city} ${state} storage facility rental, ${value} ${city} storage facility rental, ${value} storage facility rental, 
            Self storage for rent near ${value}, Self storage near ${value} ${city} ${state}, Self storage near ${value} ${city}, 
            Self storage near ${value}, ${city} self storage near ${value}, ${city} ${state} self storage near ${value}, 
            Self storage nearby ${value} ${city} ${state}, Self storage nearby ${value} ${city}, Self storage nearby ${value}, 
            ${city} self storage nearby ${value}, ${city} ${state} self storage nearby ${value}, Self storage in ${value} ${city} ${state}, 
            Self storage in ${value} ${city}, Self storage in ${value}, ${value} ${city} ${state} self storage, ${value} ${city} self storage, 
            ${value} self storage, ${value} self storage in ${city} ${state}, ${value} self storage in ${city}, ${city} ${state} self storage in ${value}, 
            ${city} self storage in ${value}, Storage for rent nearby ${value} ${city}, Storage for rent nearby ${value}, ${city} storage for rent nearby ${value}, 
            Storage near ${value} ${city} ${state}, Storage near ${value} ${city}, Storage near ${value}, ${city} storage near ${value}, 
            ${city} ${state} storage near ${value}, Storage nearby ${value} ${city} ${state}, Storage nearby ${value} ${city}, Storage nearby ${value}, 
            ${city} storage nearby ${value}, ${city} ${state} storage nearby ${value}, Storage in ${value} ${city} ${state}, Storage in ${value} ${city}, 
            Storage in ${value}, ${value} ${city} ${state} storage, ${value} ${city} storage, ${value} storage, ${value} storage in ${city} ${state}, 
            ${value} storage in ${city}, ${city} ${state} storage in ${value}, ${city} storage in ${value}, ${value} self storage units for rent, 
            Self storage units near ${value} ${city}, Self storage units near ${value}, ${city} self storage units near ${value}, Self storage units nearby ${value} ${city}, 
            Self storage units nearby ${value}, ${city} self storage units nearby ${value}, Storage units near ${value} ${city} ${state}, Storage units near ${value} ${city}, 
            Storage units near ${value}, ${city} ${state} storage units near ${value}, ${city} storage units near ${value}, Storage units nearby ${value} ${city} ${state}, 
            Storage units nearby ${value} ${city}, Storage units nearby ${value}, ${city} ${state} storage units nearby ${value}, ${city} storage units nearby ${value}, 
            Storage units for rent near ${value}, Storage units for rent nearby ${value}, Storage units for rent in ${value}, ${value} storage units for rent, 
            ${value} ${city} storage units for rent, Self storage places near ${value} ${city}, Self storage places near ${value}, ${city} self storage places near ${value}, 
            Storage places near ${value} ${city} ${state}, Storage places near ${value} ${city}, Storage places near ${value}, ${city} ${state} storage places near ${value}, 
            ${city} storage places near ${value}, Storage places nearby ${value} ${city} ${state}, Storage places nearby ${value} ${city}, 
            Storage places nearby ${value}, ${city} ${state} storage places nearby ${value}, ${city} storage places nearby ${value}, Storage rental places in ${value} ${city}, 
            Storage rental places in ${value}, ${city} storage rental places in ${value}, ${value} ${city} ${state} storage rental places, 
            ${value} ${city} storage rental places, ${value} storage rental places, ${value} storage rental places in ${city}`,
          landmark_phrases: `Self storage facilities near ${value}, ${city} self storage facilities near ${value}, Storage facilities near ${value} in ${city}, 
            Storage facilities near ${value}, ${city} storage facilities near ${value}, Self storage facilities nearby ${value}, ${city} self storage facilities nearby ${value}, 
            Storage facilities nearby ${value} in ${city}, Storage facilities nearby ${value}, ${city} storage facilities nearby ${value}, 
            Storage facilities nearby ${value} in ${city}, Storage facilities nearby ${value}, ${city} storage facilities nearby ${value}, 
            Storage facilities nearby ${value} in ${city}, Storage facilities nearby ${value}, ${city} storage facilities nearby ${value}, 
            Storage facility rental nearby ${value}, ${city} storage facility rental nearby ${value}, Self storage for rent near ${value}, 
            Self storage near ${value} in ${city}, Self storage near ${value}, ${city} self storage near ${value}, Self storage by ${value} in ${city}, 
            Self storage by ${value}, ${city} self storage by ${value}, Storage near ${value} in ${city} ${state}, Storage near ${value} in ${city}, 
            Storage near ${value}, ${city} storage near ${value}, Storage by ${value} in ${city} ${state}, Storage by ${value} in ${city}, Storage by ${value}, 
            ${city} storage by ${value}, Self storage units near ${value} in ${city}, Self storage units near ${value}, ${city} self storage units near ${value}, 
            Storage units near ${value} in ${city}, Storage units near ${value}, ${city} storage units near ${value}, Storage units for rent near ${value}, 
            Storage units for rent by ${value}`
        },
        sl: {
          neighborhood_phrases: `Active senior living in ${value}, Active senior living in ${value} ${city}, Senior living in ${value}, 
            Senior living in ${value} ${city}, Senior living near ${value}, Senior living near ${value} ${city}, 
            Senior living communities near ${value}, Senior living communities near ${value} ${city}, Senior living communities in ${value}, 
            Senior living communities in ${value} ${city}, Senior living facilities near ${value}, Senior living facilities near ${value} ${city}, 
            Senior living facilities in ${value}, Senior living facilities in ${value} ${city}, Senior living residences in ${value}, 
            Senior living residences in ${value} ${city}, Aged care in ${value}, Aged care in ${value} ${city}, Aged care homes in ${value}, 
            Aged care homes in ${value} ${city}, Aged care services in ${value}, Aged care services in ${value} ${city}, Assisted living in ${value}, 
            Assisted living in ${value} ${city}, Assisted living near ${value}, Assisted living near ${value} ${city}, Assisted living communities in ${value}, 
            Assisted living communities in ${value} ${city}, Assisted living communities near ${value}, Assisted living communities near ${value} ${city}, 
            Assisted living facilities in ${value}, Assisted living facilities in ${value} ${city}, Assisted living facilities near ${value}, 
            Assisted living facilities near ${value} ${city}, Assisted living homes in ${value}, Assisted living homes in ${value} ${city}, 
            Assisted living homes near ${value}, Assisted living homes near ${value} ${city}, Assisted living memory care near ${value}, 
            Assisted living residence in ${value}, Assisted living residence in ${value} ${city}, Assisted living services in ${value}, 
            Assisted living services in ${value} ${city}, Senior assisted living in ${value}, Senior assisted living in ${value} ${city}, 
            Senior assisted living near ${value}, Senior assisted living near ${value} ${city}, Senior assisted living facilities in ${value}, 
            Hospice services in ${value}, Hospice services in ${value} ${city}, Hospice care in ${value}, Hospice care in ${value} ${city}, 
            Hospice care near ${value}, Hospice care near ${value} ${city}, Hospice near ${value}, Hospice near ${value} ${city}, 
            Elderly care in ${value}, Elderly care in ${value} ${city}, Elderly care near ${value}, Elderly care near ${value} ${city}, 
            Elderly home care in ${value}, Elderly home care in ${value} ${city}, Independent living communities in ${value}, 
            Independent living communities in ${value} ${city}, Independent living in ${value}, Independent living in ${value} ${city}, 
            Independent living near ${value}, Independent living near ${value} ${city}, Independent living facilities in ${value}, 
            Independent living facilities in ${value} ${city}, Independent living facilities near ${value}, Independent living facilities near ${value} ${city}, 
            Independent senior living in ${value}, Independent senior living in ${value} ${city}, Independent senior living near ${value}, 
            Independent senior living near ${value} ${city}, Senior apartments independent living in ${value}, Senior independent living communities in ${value}, 
            Senior independent living in ${value}, Senior independent living in ${value} ${city}, Senior independent living near ${value}, 
            Senior independent living near ${value} ${city}, Memory care in ${value}, Memory care in ${value} ${city}, Memory care near ${value}, 
            Memory care near ${value} ${city}, Memory care assisted living in ${value}, Skilled nursing facility in ${value}, 
            Skilled nursing facility in ${value} ${city}, Skilled nursing facility near ${value}, Skilled nursing facility near ${value} ${city}, 
            Skilled nursing home in ${value}, Skilled nursing home in ${value} ${city}, Skilled nursing near ${value}, Skilled nursing near ${value} ${city}, 
            Respite care in ${value}, Respite care in ${value} ${city}, Respite care near ${value}, Respite care near ${value} ${city}, 
            Respite home in ${value}, Respite home in ${value} ${city}, Respite services in ${value}, Respite services in ${value} ${city}, 
            Senior apartments in ${value}, Senior apartments in ${value} ${city}, Senior apartments near ${value}, Senior apartments near ${value} ${city}, 
            Senior care facilities in ${value}, Senior care facilities in ${value} ${city}, Senior care facilities near ${value}, 
            Senior care facilities near ${value} ${city}, Senior care near ${value}, Senior care near ${value} ${city}, Senior citizen housing near ${value}, 
            Senior citizen housing near ${value} ${city}, Senior citizen living in ${value}, Senior citizen living in ${value} ${city}, Senior communities in ${value}, 
            Senior communities in ${value} ${city}, Senior communities near ${value}, Senior communities near ${value} ${city}, Senior housing in ${value}, 
            Senior housing in ${value} ${city}, Senior housing near ${value}, Senior housing near ${value} ${city}, Senior home care in ${value}, 
            Senior home care in ${value} ${city}, Senior home in ${value}, Senior home in ${value} ${city}`,
          landmark_phrases: `independent living near ${value}, independent living near ${value} ${city}, independent living by ${value}, independent living by ${value} ${city}, 
            assisted living near ${value}, assisted living near ${value} ${city}, assisted living by ${value}, assisted living by ${value} ${city}, 
            senior living near ${value}, senior living near ${value} ${city}, senior living by ${value}, senior living by ${value} ${city}, memory care near ${value}, 
            memory care near ${value} ${city}, memory care by ${value}, memory care by ${value} ${city}, hospice care near ${value}, hospice care near ${value} ${city}, 
            hospice care by ${value}, hospice care by ${value} ${city}, respite care near ${value}, respite care near ${value} ${city}, respite care by ${value}, 
            respite care by ${value} ${city}`
        }
      }
      return phrases[vertical][type]
    }
  }
}
</script>

<style>

</style>
