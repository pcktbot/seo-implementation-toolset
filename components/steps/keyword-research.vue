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
          <span :id="disabledKeywordsToolTip" class="block" tabindex="0" block>
            <b-btn
              @click="getKeywords(apiProps)"
              :disabled="disabledGetKeywords"
              variant="secondary"
              class="mb-1"
              block
            >
              <div class="d-flex justify-content-center">
                Get Keywords
                <b-spinner v-if="loading" class="mt-1 ml-1" small label="Loading..." />
              </div>
            </b-btn>
            <b-tooltip target="get-keywords" variant="secondary" placement="topleft">
              missing address fields
            </b-tooltip>
          </span>
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
      <b-alert
        :show="dismissCountDown"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
        variant="warning"
        dismissible
      >
        {{ alertMsg }}
      </b-alert>
      <b-row>
        <b-col
          v-for="(input, index) in getInputs"
          :key="`${input}-${index}`"
          class="col-12 col-md"
        >
          <label :for="input">
            {{ `${input.replace(/_/g,' ').toUpperCase()}` }}
          </label>
          <b-container :style="getStateStyle(input)" class="p-1 mr-0 ml-0 keywords">
            <draggable
              :list="compform[input]"
              :group="{ name: input, put: true }"
              @change="onAdd(input, $event)"
              class="dragArea list-group pill-box"
            >
              <b-list-group-item
                v-for="element in compform[input]"
                :key="`${input}-${element.id}`"
                :state="validateField(input)"
                class="list-group-item pillz"
              >
                <div class="form-inline">
                  <b-input
                    :key="`${element.id}`"
                    v-autowidth="{maxWidth: '960px', minWidth: '20px', comfortZone: 0}"
                    v-model="element.name"
                    @input="updateKeyword(input, element.id, $event)"
                    style="background-color: var(--quaternary); border: none; height: 1.25em; .form-control:focus "
                    type="text"
                    class="p-0"
                  />
                  <span @click="removeAt(input, element.id)" class="m-0 p-0" onmouseover="" style="cursor: pointer;">
                    <b-img width="17" height="17" src="/red-x.svg" />
                  </span>
                </div>
              </b-list-group-item>
            </draggable>
          </b-container>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-for="keyword in getKeywordInputs"
          :key="keyword"
          class="col-12 col-lg col-xl"
        >
          <div class="form-inline">
            <label :for="`textarea-${keyword}`">
              {{ `${keyword.replace(/_/g,' ').toUpperCase()}` }}
              <b-button
                @click="addKeyword(keyword)"
                size="sm"
                variant="secondary"
                class="mx-1"
                style="padding: 0rem 0.15rem; margin-bottom: 4px;"
              >
                <b-icon icon="plus" />
              </b-button>
              <b-form-input
                v-model="keywordInput[keyword]"
                size="sm"
                style="height: 1.7em; margin-bottom: 4px;"
                placeholder="add keywords here"
              />
            </label>
          </div>
          <b-container class="p-2 mr-0 ml-0 keywords" style="border: 1.5px solid #ccc; width: 100%; height: 250px; overflow-y: scroll; scroll-behavior: smooth">
            <draggable
              :list="compform[keyword]"
              :group="{ name: keyword, pull: 'clone', put: false }"
              :clone="cloneItem"
              @change="log"
              class="dragArea list-group pill-box"
            >
              <b-list-group-item
                v-for="element in compform[keyword]"
                :key="`${keyword}-${element.id}`"
                class="list-group-item pillz"
              >
                <div class="form-inline">
                  <b-input
                    :key="`${element.id}`"
                    v-autowidth="{maxWidth: '960px', minWidth: '20px', comfortZone: 0}"
                    v-model="element.name"
                    @input="updateKeyword(keyword, element.id, $event)"
                    style="background-color: var(--quaternary); border: none; height: 1.25em;"
                    type="text"
                    class="p-0"
                  />
                  <span @click="removeAt(keyword, element.id)" class="m-0 p-0" onmouseover="" style="cursor: pointer;">
                    <b-img width="17" height="17" src="/red-x.svg" style="position: relative; bottom: .5px;" />
                  </span>
                </div>
              </b-list-group-item>
            </draggable>
          </b-container>
        </b-col>
      </b-row>
      <!-- Phrases Section -->
      <b-row>
        <b-col
          v-for="phrase in getPhraseInputs"
          :key="phrase"
          class="col-12 col-md"
        >
          <b-form-group
            class="pb-0 mb-0 text-left text-uppercase"
          >
            <label :for="`textarea-${phrase}`">
              {{ `${phrase.replace(/_/g,' ').toUpperCase()}` }}
              <b-button @click="copyPhrases(phrase)" class="p-0 m-0" variant="light">
                <b-img
                  src="/copy-icon.png"
                  width="20"
                  height="20"
                  class="jello-vertical"
                />
              </b-button>
              <span style="font-weight:normal;">
                {{ text }}
              </span>
            </label>
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
import draggable from 'vuedraggable'
import SaveStep from '~/components/save-step'
import PhraseGenerator from '~/mixins/phrases'
import Diacritics from '~/mixins/diacritics'
let idGlobal = 1000
export default {
  components: {
    SaveStep,
    draggable
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
      list2: [],
      keywordInput: {
        neighborhood_keywords: '',
        landmark_keywords: '',
        amenity_keywords: '',
        comm_amenity_keywords: '',
        api_neighborhood_keywords: '',
        api_landmark_keywords: ''
      },
      splitRgx: /\s*(?:,|$)\s*/,
      text: '',
      alertMsg: 'Get Keywords Failed. Check the address for this location',
      dismissSecs: 5,
      dismissCountDown: 0,
      showDismissibleAlert: false,
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
      return this.getApiProps()
    },
    disabledGetKeywords() {
      return !this.validApiProps()
    },
    displaySaveTip() {
      return !this.validateStepTwo() ? 'step-two-tip' : 'not-disabled'
    },
    disabledKeywordsToolTip() {
      return !this.validApiProps() ? 'get-keywords' : 'not-disabled'
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
          comm_amenity_keywords: this.location.properties.comm_amenity_keywords,
          api_neighborhood_keywords: this.location.properties.api_neighborhood_keywords,
          api_landmark_keywords: this.location.properties.api_landmark_keywords,
          negative_keywords: this.location.properties.negative_keywords
        }
      },
      set(val) {}
    }
  },
  methods: {
    log(evt) {
      window.console.log(evt)
    },
    onAdd(input, payload) {
      const { id } = payload.added.element
      if (this.compform[input].length === 2) {
        const itemIndex = this.compform[input].findIndex(item => item.id !== id)
        const removeID = this.compform[input][itemIndex].id
        this.removeAt(input, removeID)
      }
    },
    cloneItem(payload) {
      const { name } = payload
      return { id: idGlobal++, name: `${name}` }
    },
    removeAt(list, id) {
      const idx = this.compform[list].findIndex(item => item.id === id)
      this.$emit('remove-keyword', { key: list, index: idx, id: this.location.id })
    },
    updateKeyword(property, id, event) {
      const idx = this.compform[property].findIndex(item => item.id === id)
      this.$emit('update-keyword', { key: property, index: idx, data: event, locId: this.location.id })
    },
    addKeyword(property) {
      const value = this.keywordInput[property]
      this.keywordInput[property] = ''
      this.$emit('add-keyword', { key: property, val: value, id: this.location.id })
    },
    copyPhrases(id) {
      this.$copyText(this.location.properties[id])
      this.text = 'Copied!'
      // eslint-disable-next-line no-return-assign
      setTimeout(() => this.text = '', 3000)
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    onSave() {
      this.$emit('step-save')
    },
    getFields() {
      return this.form.selects[0].value === 'mf'
        ? this.mfRequiredFields
        : []
    },
    getApiProps() {
      return {
        vertical: this.form.selects[0].value,
        address: this.location.properties.street_address_1,
        class: this.location.properties.class,
        city: this.location.properties.city,
        state: this.location.properties.state,
        zip: this.location.properties.postal_code
      }
    },
    validApiProps() {
      let val = true
      const obj = this.getApiProps()
      delete obj.class
      for (const key in obj) {
        if (!obj[key]) {
          val = false
          break
        }
      }
      return val
    },
    getStateStyle(field) {
      const val = this.validateField(field)
      return (val) ? 'border: 1px solid #ced4da; height:42px; border-radius: 0.25rem' : 'border: 1px solid red; height:42px; border-radius: 0.25rem'
    },
    validateField(field) {
      let valid = true
      const reqFields = this.getFields()
      if (reqFields.includes(field)) {
        const val = this.location.properties[field]
        if (val === '' || val === null || val.length === 0) {
          valid = false
        }
      }
      return valid
    },
    validateStepTwo() {
      let valid = true
      const reqFields = this.getFields()
      for (const index in reqFields) {
        const field = this.compform[reqFields[index]]
        if (field === '' || field === null || field.length === 0) {
          valid = false
          break
        }
      }
      return valid
    },
    makeObject(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = { name: arr[i], id: i }
      }
      return arr
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
          this.$emit('step-update', { key: 'api_neighborhood_keywords', val: this.makeObject(neighborhoodKeywords), id: this.location.id })
          this.$emit('step-update', { key: 'api_landmark_keywords', val: this.makeObject(landmarkKeywords), id: this.location.id })
          this.loading = false
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err)
          this.showAlert()
          this.loading = false
        })
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    },
    splitMapFilterTrim(data1, data2) {
      return data1.concat(data2)
        .map(item => item.name.trim())
        .filter(item => item)
    },
    getKeywordsObj() {
      // eslint-disable-next-line camelcase
      const { api_neighborhood_keywords, neighborhood_keywords, api_landmark_keywords, landmark_keywords } = this.location.properties
      return {
        neighborhood_phrases: this.splitMapFilterTrim(api_neighborhood_keywords, neighborhood_keywords),
        landmark_phrases: this.splitMapFilterTrim(api_landmark_keywords, landmark_keywords),
        amenity_phrases: this.form.selects[0].value === 'mf'
          ? this.compform.amenity_keywords
            .concat(this.compform.comm_amenity_keywords)
            .map(item => item.name.trim()).filter(item => item)
          : []
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
@media only screen and (min-width: 1200px) {
  .container {
    max-width: 2500px;
  }
}
.keywords .form-control:focus {
  box-shadow: none;
}
.pillz  {
    color: black;
    background:var(--quaternary);
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: default;
    float: left;
    padding: 4px 15px;
    min-width: 70px;
    min-height: 32px;
}
.pill-box  {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    line-height: 1.42857143;
    list-style: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
