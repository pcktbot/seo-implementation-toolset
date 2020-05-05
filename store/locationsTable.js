export const state = () => ({
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
  SET_ITEMS(state, res) {
    state.items = [
      ...res.map((location) => {
        const { name, properties } = location
        return {
          select: false,
          location: `${name} - ${properties.street_address_1}`,
          status: properties.locationComplete,
          value: location.id,
          prstatus: properties.prComplete
        }
      })
    ]
  }
}
