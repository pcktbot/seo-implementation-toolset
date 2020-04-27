export const state = () => ({
  locationtbl: {
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
  }
})
export const gettters = {}
export const actions = {}
export const mutations = {}
