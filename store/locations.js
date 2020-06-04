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
  ADD(state, locations) {
    locations.forEach(loc => state.locations.push(loc))
  }
}
