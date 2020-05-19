export const state = () => ({
  locations: []
})

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
      : state.locations[i].properties[key] = val
  },
  ADD(state, locations) {
    locations.forEach(loc => state.locations.push(loc))
  },
  DELETE_KEYWORD(state, { locIndex, key, index }) {
    state.locations[locIndex].properties[key].splice(index, 1)
  },
  UPDATE_KEYWORD(state, { locIndex, key, index, data }) {
    state.locations[locIndex].properties[key][index].name = data
  },
  ADD_KEYWORD(state, { data, locIndex, key }) {
    state.locations[locIndex].properties[key].push(data)
  },
  UPDATE_THREE_LAYERS(state, { key1, key2, key3, key4, val }) {
    state.locations[key1][key2][key3][key4] = val
  },
  MOVE_KEYWORD(state, { locIndex, key, val }) {
    state.locations[locIndex].properties[key] = val
  }
}
