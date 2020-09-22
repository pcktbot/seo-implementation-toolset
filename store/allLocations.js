export const state = () => ({
  value: null,
  options: []
})

export const actions = {
  async GET({ commit }) {
    await this.$axios
      .$get(`api/locations`)
      .then((res) => {
        const newRes = res.map((row) => {
          const intName = row.properties.internal_branded_name
          const name = row.name
          return {
            text: intName || name,
            value: row.lpId
          }
        })
        commit('SET', { options: newRes })
      })
  }
}

export const mutations = {
  SET(state, obj) {
    const keys = Object.keys(obj)
    // eslint-disable-next-line no-console
    console.log(obj)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = obj[key])
  }
}
