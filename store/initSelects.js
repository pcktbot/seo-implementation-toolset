export const state = () => ({
  visible: false,
  inputs: {
    lpId: null,
    file: null
  },
  loading: false,
  alertMsg: '',
  alertvariant: '',
  dismissSecs: 5,
  dismissCountDown: 0,
  existingLPMsg: 'There is already a LP project under this ID. To add additional locations, load the LP project',
  successLoadMsg: 'Successfully loaded locations',
  errLoadMsg: 'Error loading location/s, check to ensure the url is using the correct LP ID',
  csvSuccessMsg: 'Your new location/s have beeen successfully added, please select a location below',
  csvErrMsg: 'There was an error uploading the csv',
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
  ]
})

export const getters = {
  getSelects(state) {
    return state.selects
  },
  getLpId(state) {
    return state.inputs.lpId
  },
  getFile(state) {
    return state.inputs.file
  }
}

export const mutations = {
  updateSelects(state, { val, index }) {
    state.selects[index].value = val
  }
}
