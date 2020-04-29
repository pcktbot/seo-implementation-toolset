// controls the form stepper tab index
export const state = () => ({
  index: 0
})

export const getters = {
  getIndex(payload) {
    return payload
  }
}

export const mutations = {
  set(state, index) {
    state.index = index
  }
}
