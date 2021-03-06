export const state = () => ({
  fields: [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      sortDirection: 'desc'
    },
    {
      key: 'strategy',
      label: 'Strategy',
      sortable: true
    },
    {
      key: 'current_url',
      label: 'Original URL',
      sortable: true
    },
    {
      key: 'new_url',
      label: 'Goes To',
      sortable: true
    },
    // {
    //   key: 'formatted_url',
    //   label: 'Formatted URL',
    //   sortable: true
    // },
    {
      key: 'entered',
      label: 'Entered'
    }
  ],
  items: [],
  totalRows: 1,
  currentPage: 1,
  perPage: 15,
  pageOptions: [10, 15, 20, 50, 100, 1000],
  sortBy: '',
  sortDesc: false,
  sortDirection: 'asc',
  filter: '',
  filterOn: [],
  options: [
    { value: null, text: 'Select Strategy' },
    { value: 'Same Domain', text: 'Same Domain' },
    { value: 'Cross Domain', text: 'Cross Domain' },
    { value: 'Secure Cross Domain', text: 'Secure Cross Domain' },
    { value: 'Secure Naked Same Domain', text: 'Secure Naked Same Domain' },
    { value: 'No Redirects', text: 'No Redirects' }
  ],
  iconConfig: {
    width: '30',
    height: '30',
    true: '/check-box.svg',
    false: '/square.svg'
  },
  saveData: {
    tooltipTargetID: 'step-three-tip',
    stepUpdateTxt: 'stepThreeComplete'
  },
  current_url_btn: 'Copy Original URL\'s',
  formatted_url_btn: 'Copy Formatted URL\'s',
  saveButton: 'Save',
  current_url_msg: '',
  formatted_url_msg: ''
})

export const actions = {}

export const mutations = {
  SET(state, obj) {
    const keys = Object.keys(obj)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = obj[key])
  },
  SET_KEYWORD_INPUT(state, { key, val }) {
    state.keywordInput[key] = val
  }
}
