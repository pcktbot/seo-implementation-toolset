export const state = () => ({
  locationNotes: [],
  projectNotes: [],
  allNotes: [],
  projectNoteField: '',
  saveTxt: 'Save',
  toggle: {
    selected: 'project'
  },
  fields: [
    {
      key: 'author',
      label: 'Name'
    },
    {
      key: 'updatedAt',
      label: 'Date'
    },
    {
      key: 'text',
      label: 'Comment'
    }
  ]
})
export const gettters = {
  getLocationNotes(state, id) {
    return state.allNotes.filter(note => note.locationId === id)
  }
}
export const actions = {
  async GET_AND_SET({ commit, state }, lpId, locationId) {
    const query = (locationId)
      ? `locationId=${locationId}`
      : `lpId=${lpId}`
    const all = await this.$axios.$get(`api/comments?${query}`)
    commit('SET', { 'allNotes': all })
    const project = state.allNotes.filter(note => note.locationId === null)
    commit('SET', { 'projectNotes': project })
  }
}

export const mutations = {
  SET(state, obj) {
    const keys = Object.keys(obj)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = obj[key])
  },
  SET_TOGGLE(state, { val }) {
    state.toggle.selected = val
  }
}
