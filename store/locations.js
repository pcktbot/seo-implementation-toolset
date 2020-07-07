export const state = () => ({
  locations: []
})

export const actions = {
  async GET({ commit }, lpId) {
    const val = await this.$axios
      .$get(`api/locations/${lpId}`)
      .then((res) => {
        res.forEach((location) => {
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
  }
}
