export const state = () => ({
  visible: true,
  lpId: null,
  file: null,
  loading: false,
  selects: [
    {
      id: 'vertical',
      value: null,
      options: [
        { value: null, text: 'Select Vertical' },
        { value: 'mf', text: 'Multi-Family' },
        { value: 'ss', text: 'Self Storage' },
        { value: 'sl', text: 'Senior Living' }
      ]
    },
    {
      id: 'domain',
      value: null,
      options: [
        { value: null, text: 'Select Domain Strategy' },
        { value: 'multi', text: 'Multi Domain' },
        { value: 'single', text: 'Single Domain' }
      ]
    },
    {
      id: 'branding',
      value: null,
      options: [
        { value: null, text: 'Select Chain Branding' },
        { value: 'yes', text: 'Yes' },
        { value: 'no', text: 'No' }
      ]
    }
  ],
  toggle: {
    selected: 'upload',
    options: [
      { text: 'New LP Project', value: 'upload' },
      { text: 'Load LP Project', value: 'import' }
    ]
  }
})

export const getters = {
  selectedToggle(state) {
    return state.toggle.selected
  },
  visible(state) {
    return state.visible
  }
}

export const actions = {
  GET({ commit, state }, lpID) {
    this.$axios
      .$get(`api/lp-project/${lpID}`)
      .then((res) => {
        commit('SET', { 'lpId': res[0].lpId })
        state.selects.forEach((select, i) => {
          commit('UPDATE_SELECTS', { val: res[0][select.id], index: i })
        })
      })
  }
}

export const mutations = {
  UPDATE_SELECTS(state, { val, index }) {
    state.selects[index].value = val
  },
  UPDATE_TOGGLE(state, val) {
    state.toggle.selected = val
  },
  SET(state, obj) {
    const keys = Object.keys(obj)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = obj[key])
  }
}
