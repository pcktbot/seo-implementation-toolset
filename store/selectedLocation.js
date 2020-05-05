export const state = () => ({
  location: null
})
export const getters = {
  getProperties: (state) => {
    return state.location
      ? state.location.properties
      : null
  },
  getLocationID: (state) => {
    return state.location ? state.location.id : null
  }
}
export const actions = {}
export const mutations = {}
