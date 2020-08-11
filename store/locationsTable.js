export const state = () => ({
  mfOptions: [
    {
      value: null,
      text: 'Select'
    },
    {
      value: 'basic',
      text: 'Basic'
    },
    {
      value: 'professional',
      text: 'Professional'
    },
    {
      value: 'elite',
      text: 'Elite'
    }
  ],
  ssOptions: [
    {
      value: null,
      text: 'Select'
    },
    {
      value: 'starter',
      text: 'Starter'
    },
    {
      value: 'professional',
      text: 'Professional'
    },
    {
      value: 'elite',
      text: 'Elite'
    }
  ],
  slOptions: [
    {
      value: null,
      text: 'Select'
    },
    {
      value: 'affordable',
      text: 'Affordable'
    },
    {
      value: 'enterprise',
      text: 'Enterprise'
    }
  ],
  fields: [
    {
      key: 'select',
      label: 'Select'
    },
    {
      key: 'location',
      label: 'Location Name',
      sortable: true
    },
    {
      key: 'corporate',
      label: 'Corp',
      sortable: true
    },
    {
      key: 'service_level',
      label: 'Service Level',
      sortable: true
    },
    {
      key: 'edit',
      label: 'Edit'
    },
    {
      key: 'status',
      label: 'Complete',
      sortable: true,
      class: 'text-center'
    },
    {
      key: 'prstatus',
      label: 'PR Complete',
      sortable: true,
      class: 'text-center'
    }
  ],
  items: [],
  selectMode: 'multi',
  selected: []
})
export const gettters = {}
export const actions = {}
export const mutations = {
  SET_MAP_ITEMS(state, res) {
    const newItems = [
      ...res.map((location) => {
        const { name, properties } = location
        return {
          select: false,
          corporate: properties.corporate === 'true',
          service_level: properties.service_level,
          location: `${name} - ${properties.street_address_1}`,
          status: properties.locationComplete,
          value: location.id,
          prstatus: properties.prComplete
        }
      })
    ]
    state.items.length === 0
      ? state.items = newItems
      : state.items = state.items.concat(...newItems)
  },
  SET(state, obj) {
    const keys = Object.keys(obj)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = obj[key])
  },
  SET_ITEM(state, { index, field, val }) {
    state.items[index][field] = val
  },
  SET_SELECTED(state, val) {
    state.selected = val
  }
}
