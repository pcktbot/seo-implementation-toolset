
export const state = () => ({
  firstName: '',
  lastName: '',
  email: '',
  role: ''
})

export const mutations = {
  SET(state, { firstName, lastName, email, role }) {
    state.firstName = firstName
    state.lastName = lastName
    state.email = email
    state.role = role
  }
}

export const actions = {
  get({ commit }) {
    this.$axios
      .$get('api/auth/me')
      .then(res => commit('SET', res))
  }
}
