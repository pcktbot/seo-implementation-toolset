export const state = () => ({
  locations: []
})
export const getters = {
  getLocationIndex(state, id) {
    return state.locations.findIndex(loc => loc.id === id)
  }
}

export const actions = {
  async GET({ commit }, lpId) {
    const val = await this.$axios
      .$get(`api/locations/${lpId}`)
      .then((res) => {
        commit('SET', res)
        return res
      })
    return val
  }
}

export const mutations = {
  SET(state, val) {
    state.locations = val
  },
  UPDATE_PROP(state, { key, val, id }) {
    const i = state.locations.findIndex(loc => loc.id === id)
    key === 'name'
      ? state.locations[i][key] = val
      : this.locations[i].properties[key] = val
  },
  ADD(state, locations) {
    locations.forEach(loc => state.locations.push(loc))
  }
}
