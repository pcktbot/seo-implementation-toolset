export const state = () => ({
  population: null,
  uspsvalid: null,
  recommended_name: null,
  redirects: {
    fields: [
      {
        key: 'strategy',
        label: 'Strategy'
      },
      {
        key: 'current_url',
        label: 'Current URL',
        sortable: true
      },
      {
        key: 'formatted_url',
        label: 'Formatted URL',
        sortable: true
      },
      {
        key: 'select',
        label: 'Select'
      }
    ],
    items: [],
    selected: []
  },
  redirecttext: '',
  redirectstrat: null,
  stepOneComplete: false,
  stepTwoComplete: false,
  stepThreeComplete: false,
  stepFourComplete: false,
  locationComplete: false,
  prComplete: false,
  gmb: null,
  ga: null,
  strategy: null,
  api_neighborhood_keywords: [],
  api_landmark_keywords: [],
  neighborhood_phrases: '',
  landmark_phrases: '',
  amenity_phrases: '',
  locationNote: ''
})
export const getters = {
  getAddPropFields(state) {
    return state
  }
}
export const actions = {}
export const mutations = {}
