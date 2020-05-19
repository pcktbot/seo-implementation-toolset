export const state = () => ({
  location: null
})
export const getters = {
  stepOneData: (state) => {
    let val = null
    if (state.location) {
      val = {
        name: state.location.name,
        recommended_name: state.location.properties.recommended_name,
        street_address_1: state.location.properties.street_address_1,
        city: state.location.properties.city,
        state: state.location.properties.state,
        postal_code: state.location.properties.postal_code,
        country: state.location.properties.country,
        population: state.location.properties.population,
        uspsvalid: state.location.properties.uspsvalid,
        floor_plans: state.location.properties.floor_plans,
        property_feature_1: state.location.properties.property_feature_1,
        custom_slug: state.location.properties.custom_slug
      }
    }
    return val
  },
  stepTwoData: (state) => {
    let val = null
    if (state.location) {
      val = {
        neighborhood: state.location.properties.neighborhood,
        neighborhood_2: state.location.properties.neighborhood_2,
        landmark_1_name: state.location.properties.landmark_1_name,
        apartment_amenity_1: state.location.properties.apartment_amenity_1,
        community_amenity_1: state.location.properties.community_amenity_1,
        neighborhood_keywords: state.location.properties.neighborhood_keywords,
        landmark_keywords: state.location.properties.landmark_keywords,
        amenity_keywords: state.location.properties.amenity_keywords,
        api_neighborhood_keywords: state.location.properties.api_neighborhood_keywords,
        api_landmark_keywords: state.location.properties.api_landmark_keywords,
        negative_keywords: state.location.properties.negative_keywords
      }
    }
    return val
  }
}
export const actions = {}
export const mutations = {
  SET(state, val) {
    state.location = val
  },
  SET_PROPERTY(state, { key, val }) {
    state.location.properties[key] = val
  }
}
