
export const state = () => ({
  firstName: '',
  lastName: '',
  email: '',
  role: ''
})

export const actions = {
  GET({ commit }, data) {
    this.$axios
      .$get('api/auth/me')
      .then(res => commit('SET', res))
  }
}

export const mutations = {
  SET(state, { firstName, lastName, email, role }) {
    state.firstName = firstName
    state.lastName = lastName
    state.email = email
    state.role = role
  }
}
