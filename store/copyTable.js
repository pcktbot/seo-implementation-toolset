export const state = () => ({
  mfHeaders: ['status', 'name', 'address', 'neighborhood', 'neighborhood_2', 'floor_plans', 'landmark', 'property_feature_1', 'apartment_amenity_1', 'community_amenity_1', 'strategy'],
  otherHeaders: ['status', 'name', 'address', 'neighborhood', 'neighborhood_2', 'landmark', 'strategy'],
  items: []
})
export const gettters = {}
export const actions = {}
export const mutations = {
  SET_MAP_ITEMS(state, res) {
    const newItems = [
      ...res.map((location) => {
        const { name, properties } = location
        return {
          status: properties.locationComplete,
          name: `${name}`,
          address: `${properties.street_address_1} ${properties.city} ${properties.state} ${properties.postal_code}`,
          neighborhood: properties.neighborhood.length > 0 ? properties.neighborhood[0].name : '',
          neighborhood_2: properties.neighborhood_2.length > 0 ? properties.neighborhood_2[0].name : '',
          floor_plans: properties.floor_plans,
          landmark: properties.landmark_1_name.length > 0 ? properties.landmark_1_name[0].name : '',
          property_feature_1: properties.property_feature_1,
          apartment_amenity_1: properties.apartment_amenity_1.length > 0 ? properties.apartment_amenity_1[0].name : '',
          community_amenity_1: properties.community_amenity_1.length > 0 ? properties.community_amenity_1[0].name : '',
          strategy: properties.strategy
        }
      })
    ]
    state.items = newItems
  }
}
