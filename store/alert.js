export const state = () => ({
  alertMsg: '',
  alertvariant: '',
  dismissSecs: 5,
  dismissCountDown: 0,
  existingLPMsg: 'There is already a LP project under this ID. To add additional locations, load the LP project',
  successLoadMsg: 'Successfully loaded locations',
  errLoadMsg: 'Error loading location/s, check to ensure the url is using the correct LP ID',
  csvSuccessMsg: 'Your new location/s have beeen successfully added, please select a location below',
  csvErrMsg: 'There was an error uploading the csv'
})
export const gettters = {}
export const mutations = {
  SET(state, form) {
    const keys = Object.keys(form)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = form[key])
  }
}
export const actions = {}
