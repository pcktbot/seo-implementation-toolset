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
      ]
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
      const props = {
        vertical: this.form.selects[0].value,
        address: this.location.properties.street_address_1,
        class: this.location.properties.class,
        city: this.location.properties.city,
        state: this.location.properties.state,
        zip: this.location.properties.postal_code
      }
      let neighborhoodKeywords = []
      let landmarkKeywords = []
      this.$axios.$put('/placesapi/placesRequest', { props })
        .then((res) => {
          const { type1, type2 } = res
          for (const type in type1) {
            type1[type].forEach(place => neighborhoodKeywords.push(place))
          }
          for (const type in type2) {
            type2[type].forEach(place => landmarkKeywords.push(place))
          }
          neighborhoodKeywords = neighborhoodKeywords.toString()
          landmarkKeywords = landmarkKeywords.toString()
          this.$emit('step-update', { key: 'api_neighborhood_keywords', val: neighborhoodKeywords, id: this.location.id })
          this.$emit('step-update', { key: 'api_landmark_keywords', val: landmarkKeywords, id: this.location.id })
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
    getPhrases() {
      // const keywords = {
      //   neighborhood_phrases: this.api.api_neighborhood_keywords.concat(this.compform.neighborhood_keywords.split(',')),
      //   landmark_phrases: this.api.api_landmark_keywords.concat(this.compform.landmark_keywords.split(',')),
      //   amenity_phrases: this.form.selects[0].value === 'mf' ? this.compform.amenity_keywords.split(',') : []
      // }
      // for (const [key, arr] of keywords) {
      //   arr.forEach((keyword) => {
      //     this.keywordphrases[key].push(this.getPhrase(key, keyword))
      //   })
      // }
    },
    getPhrase(type, value) {
      const vertical = this.form.selects[0].value
      const city = this.location.properties.city
      const state = this.location.properties.state
      const phrases = {
        mf: {
          neighborhood_phrases: [`${value} apartments`, `${value} ${city} apartments`, `${value} ${city} ${state} apartments`,
            `${value} apartments in ${city}`, `${value} apartments in ${city} ${state}`, `apartments in ${value}`,
            `apartments in ${value} ${city}`, `apartments in ${value} ${city} ${state}`, `apartments ${value}`,
            `apartments ${value} ${city}`, `apartments ${value} ${city} ${state}`, `apartments ${city} in ${value}`,
            `apartments ${city} ${state} in ${value}`, `${city} apartments in ${value}`, `${city} apartments near ${value}`,
            `${city} ${state} apartments in ${value}`, `${city} ${state} apartments near ${value}`, `apartments near ${value}`,
            `apartments near ${value} ${city}`, `apartments near ${value} ${city} ${state}`, `${value} apartments near me`,
            `${value} ${city} apartments near me`, `${value} ${city} ${state} apartments near me`, `${value} apartments for rent near me`,
            `${value} apartments for rent`, `${value} ${city} apartments for rent`, `${value} ${city} ${state} apartments for rent`,
            `${value} apartments for rent in ${city}`, `${value} apartments for rent in ${city} ${state}`, `apartments for rent in ${value}`,
            `apartments for rent in ${value} ${city}`, `apartments for rent in ${value} ${city} ${state}`, `apartments for rent ${value}`,
            `apartments for rent ${value} ${city}`, `apartments for rent ${value} ${city} ${state}`, `apartments for rent ${city} in ${value}`,
            `${city} apartments for rent in ${value}`, `${city} apartments for rent near ${value}`, `apartments for rent near ${value}`,
            `apartments for rent near ${value} ${city}`, `${value} apartment building`, `${value} ${city} apartment building`,
            `${value} ${city} ${state} apartment building`, `${value} apartment building in ${city}`, `${value} apartment building in ${city} ${state}`,
            `apartment building in ${value}`, `apartment building in ${value} ${city}`, `apartment building in ${value} ${city} ${state}`,
            `apartment building ${value}`, `apartment building ${value} ${city}`, `apartment building ${value} ${city} ${state}`,
            `apartment building ${city} in ${value}`, `apartment building ${city} ${state} in ${value}`, `${city} apartment building in ${value}`,
            `${city} apartment building near ${value}`, `${city} ${state} apartment building in ${value}`, `${city} ${state} apartment building near ${value}`,
            `apartment building near ${value}`, `apartment building near ${value} ${city}`, `apartment building near ${value} ${city} ${state}`,
            `${value} apartment building near me`, `${value} ${city} apartment building near me`, `${value} apartment building for rent`,
            `${value} ${city} apartment building for rent`, `apartment building for rent in ${value}`, `apartment building for rent ${value}`,
            `apartment building for rent ${value} ${city}`, `apartment building for rent near ${value}`, `${value} apartment complexes`,
            `${value} ${city} apartment complexes`, `${value} ${city} ${state} apartment complexes`, `${value} apartment complexes in ${city}`,
            `${value} apartment complexes in ${city} ${state}`, `apartment complexes in ${value}`, `apartment complexes in ${value} ${city}`,
            `apartment complexes in ${value} ${city} ${state}`, `apartment complexes ${value}`, `apartment complexes ${value} ${city}`,
            `apartment complexes ${value} ${city} ${state}`, `apartment complexes ${city} in ${value}`, `apartment complexes ${city} ${state} in ${value}`,
            `${city} apartment complexes in ${value}`, `${city} apartment complexes near ${value}`, `${city} ${state} apartment complexes in ${value}`,
            `${city} ${state} apartment complexes near ${value}`, `apartment complexes near ${value}`, `apartment complexes near ${value} ${city}`,
            `apartment complexes near ${value} ${city} ${state}`, `${value} apartment complexes near me`, `${value} ${city} apartment complexes near me`,
            `${value} apartment complexes for rent`, `${value} ${city} apartment complexes for rent`, `apartment complexes for rent in ${value}`,
            `apartment complexes for rent ${value}`, `apartment complexes for rent ${value} ${city}`, `apartment complexes for rent near ${value}`,
            `${value} apartment homes`, `${value} ${city} apartment homes`, `${value} ${city} ${state} apartment homes`, `${value} apartment homes in ${city}`,
            `${value} apartment homes in ${city} ${state}`, `apartment homes in ${value}`, `apartment homes in ${value} ${city}`,
            `apartment homes in ${value} ${city} ${state}`, `apartment homes ${value}`, `apartment homes ${value} ${city}`, `apartment homes ${value} ${city} ${state}`,
            `apartment homes ${city} in ${value}`, `apartment homes ${city} ${state} in ${value}`, `${city} apartment homes in ${value}`,
            `${city} apartment homes near ${value}`, `${city} ${state} apartment homes in ${value}`, `${city} ${state} apartment homes near ${value}`,
            `apartment homes near ${value}`, `apartment homes near ${value} ${city}`, `apartment homes near ${value} ${city} ${state}`,
            `${value} apartment homes near me`, `${value} ${city} apartment homes near me`, `${value} apartment homes for rent`, `${value} ${city} apartment homes for rent`,
            `apartment homes for rent in ${value}`, `apartment homes for rent ${value}`, `apartment homes for rent ${value} ${city}`, `apartment homes for rent near ${value}`],
          landmark_phrases: [],
          amenities_phrases: []
        },
        ss: {
          neighborhood_phrases: [],
          landmark_phrases: []
        },
        sl: {
          neighborhood_phrases: [],
          landmark_phrases: []
        }
      }
      return phrases[vertical][type].toString()
    }
  }
}
</script>

<style>

</style>
