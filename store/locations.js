export const state = () => ({
  locations: []
})
export const getters = {
  getLocationIndex(state, id) {
    return state.locations.findIndex(loc => loc.id === id)
  }
}
export const actions = {}
export const mutations = {
  setLocations(state, data) {
    state.locations = data
  }
}
