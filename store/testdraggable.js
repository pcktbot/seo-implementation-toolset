export const state = () => ({
  list1: [
    { name: 'dog 1', id: 1 },
    { name: 'dog 2', id: 2 },
    { name: 'dog 3', id: 3 },
    { name: 'dog 4', id: 4 }
  ]
})

export const mutations = {
  SET(state, val) {
    state.list1 = val
  }
}
