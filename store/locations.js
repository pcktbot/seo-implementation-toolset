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
    // eslint-disable-next-line no-console
    console.log(key)
    // eslint-disable-next-line no-console
    console.log(val)
    // eslint-disable-next-line no-console
    console.log(id)
    const i = state.locations.findIndex(loc => loc.id === id)
    // eslint-disable-next-line no-console
    console.log(i)
    key === 'name'
      ? state.locations[i][key] = val
      : state.locations[i].properties[key] = val
  },
  ADD(state, locations) {
    locations.forEach(loc => state.locations.push(loc))
  },
  UPDATE_THREE_LAYERS(state, { key1, key2, key3, key4, val }) {
    state.locations[key1][key2][key3][key4] = val
  }
}
