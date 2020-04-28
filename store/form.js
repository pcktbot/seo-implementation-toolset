// returns object in it
// access in componenet through this.$state.(filename).(propertyname)
// ex this.$state.form.name
// map state helper in component helps access properties
// computed: {
//   ...mapState({
//     cars: state => state.cars.list,
//     car: state => state.cars.car
//   })
// }
export const state = () => ({
  name: '',
  street_address_1: '',
  city: '',
  state: '',
  postal_code: 0,
  population: null
})

export const actions = {}

export const mutations = {}
