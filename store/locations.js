export const state = () => ({
  locations: [],
  defaultService: {
    mf: 'elite',
    ss: 'elite',
    sl: 'enterprise'
  }
})

export const actions = {
  async GET({ commit, state }, { lpId, selects }) {
    const val = await this.$axios
      .$get(`api/locations/${lpId}`)
      .then((res) => {
        res.forEach((location) => {
          if (!location.properties.service_level) {
            location.properties.service_level = state.defaultService[selects[0].value]
          }
          if (!location.properties.phase) {
            location.properties.phase = 1
          }
          const redirects = location.properties.redirects.items
          if (redirects.length > 0 && redirects[0].id === undefined) {
            redirects.forEach((redirect, index) => {
              redirect.id = index
            })
          }
        })
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
  ADD(state, locations) {
    locations.forEach(loc => state.locations.push(loc))
  },
  UPDATE_REDIRECT(state, { locIdx, itemIdx, key, val }) {
    state.locations[locIdx].properties.redirects.items[itemIdx][key] = val
  },
  UPDATE_LOCATION_PROP(state, { locIdx, key, val }) {
    state.locations[locIdx].properties[key] = val
  }
}
