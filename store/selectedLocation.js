export const state = () => ({
  selectedLocation: null
})
export const getters = {
  getProperties: (state) => {
    return state.selectedLocation
      ? state.selectedLocation.properties
      : null
  },
  getLocationID: (state) => {
    return state.selectedLocation ? state.selectedLocation.id : null
  }
}
export const actions = {}
export const mutations = {}
