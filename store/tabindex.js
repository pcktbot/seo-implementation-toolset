// controls the form stepper tab index
export const state = () => ({
  index: 0
})

export const mutations = {
  set(state, index) {
    state.index = index
  }
}
