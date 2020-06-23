export const state = () => ({
  res: null,
  fields: [
    {
      key: 'select',
      label: 'Select'
    },
    {
      key: 'name',
      label: 'Name'
    },
    {
      key: 'vicinity',
      label: 'Address'
    },
    {
      key: 'rating',
      label: 'Avg Rating'
    },
    {
      key: 'user_ratings_total',
      label: 'Review Count'
    },
    {
      key: 'url',
      label: 'GMB'
    }
  ],
  selected: [],
  iconCheckConfig: {
    width: '22',
    height: '22',
    true: '/check-box.svg',
    false: '/square.svg'
  },
  saveData: {
    tooltipTargetID: 'step-four-tip',
    stepUpdateTxt: 'stepFourComplete'
  },
  saveTxt: 'Save',
  selects: [
    {
      id: 'gmb',
      value: null,
      options: [
        { value: null, text: 'Select Status' },
        { value: 'req', text: 'Requested' },
        { value: 'acc', text: 'Accessed' },
        { value: 'new', text: 'Create New' },
        { value: 'unverified', text: 'Unverified' },
        { value: 'lp', text: 'N/A Landing Page' },
        { value: 'corp', text: 'N/A Corp' },
        { value: 'basic', text: 'N/A Basic Package' },
        { value: 'clientmanaged', text: 'N/A - Client Managed' }
      ]
    },
    {
      id: 'ga',
      value: null,
      options: [
        { value: null, text: 'Select Status' },
        { value: 'req', text: 'Requested' },
        { value: 'acc', text: 'Accessed' },
        { value: 'new', text: 'Create New' },
        { value: 'current', text: 'Use Current Domain' }
      ]
    },
    {
      id: 'strategy',
      value: null,
      mfoptions: [
        { value: null, text: 'Select Strategy' },
        { value: 'mfa', text: 'MF A' },
        { value: 'mfb', text: 'MF B' },
        { value: 'mfc', text: 'MF C' },
        { value: 'townhomes', text: 'Townhomes' },
        { value: 'apartmentstownhomes', text: 'Apartments & Townhomes' },
        { value: 'mobile', text: 'Mobile Homes' },
        { value: 'fiftyfiveplus', text: '55+ Apartments' },
        { value: 'senior', text: 'Senior Apartments' },
        { value: 'student', text: 'Student Apartments' },
        { value: 'mfa1', text: 'MF A-1' },
        { value: 'mfb1', text: 'MF B-1' },
        { value: 'mfc1', text: 'MF C-1' },
        { value: 'mfa2', text: 'MF A-2' },
        { value: 'mfb2', text: 'MF B-2' },
        { value: 'mfc2', text: 'MF C-2' },
        { value: 'mfa3', text: 'MF A-3' },
        { value: 'mfb3', text: 'MF B-3' },
        { value: 'mfc3', text: 'MF C-3' },
        { value: 'mfa4', text: 'MF A-4' },
        { value: 'mfb4', text: 'MF B-4' },
        { value: 'mfc4', text: 'MF C-4' },
        { value: 'mfy', text: 'MF-Y' },
        { value: 'mfz', text: 'MF-Z' }
      ],
      ssoptions: [
        { value: null, text: 'Select Strategy' },
        { value: 'ssa', text: 'SS A' },
        { value: 'ssalandmark', text: 'SS A - Landmark' },
        { value: 'ssb', text: 'SS B' }
      ],
      sloptions: [
        { value: null, text: 'Select Strategy' },
        { value: 'sla', text: 'SL A' },
        { value: 'slb', text: 'SL B' },
        { value: 'slc', text: 'SL C' }
      ]
    }
  ]
})

export const actions = {}

export const mutations = {
  SET(state, obj) {
    const keys = Object.keys(obj)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = obj[key])
  },
  SET_SELECTED(state, val) {
    state.selected = val
  }
}
