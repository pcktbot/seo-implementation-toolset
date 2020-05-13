export const state = () => ({
  fields: [
    'name',
    'recommended_name',
    'street_address_1',
    'city'
  ],
  propertyvalue: {
    selected: null,
    options: [
      { value: null, text: 'Select Property Feature' },
      { value: 'Affordable', text: 'Affordable' },
      { value: 'Gated', text: 'Gated' },
      { value: 'Furnished', text: 'Furnished' },
      { value: 'Garden Style', text: 'Garden Style' },
      { value: 'High Rise', text: 'High Rise' },
      { value: 'New', text: 'New' },
      { value: 'Upgraded', text: 'Upgraded' },
      { value: 'Modern', text: 'Modern' },
      { value: 'Luxury', text: 'Luxury' },
      { value: 'Townhome Style', text: 'Townhome Style' },
      { value: 'Smart', text: 'Smart' },
      { value: 'Upscale', text: 'Upscale' }
    ]
  },
  saveData: {
    tooltipTargetID: 'step-one-tip',
    stepUpdateTxt: 'stepOneComplete'
  },
  res: null,
  uspsLink: 'https://tools.usps.com/zip-code-lookup.htm?byaddress',
  country: {
    selected: null,
    options: [
      { value: null, text: 'Select Country' },
      { value: 'US', text: 'United States' },
      { value: 'CA', text: 'Canada' }
    ]
  },
  uspsvalid: {
    selected: null,
    options: [
      { value: null, text: 'Is Location Address USPS Verified?' },
      { value: true, text: 'Yes - USPS Verified' },
      { value: false, text: 'No - Not USPS Verified' }
    ]
  },
  excludedRequiredFields: {
    multi: {
      mf: ['custom_slug', 'recommended_name'],
      ss: ['floor_plans', 'property_feature_1', 'custom_slug', 'recommended_name'],
      sl: ['floor_plans', 'property_feature_1', 'custom_slug', 'recommended_name']
    },
    single: {
      mf: ['recommended_name'],
      ss: ['floor_plans', 'property_feature_1', 'recommended_name'],
      sl: ['floor_plans', 'property_feature_1', 'recommended_name']
    }
  }
})

export const actions = {}

export const mutations = {
  SET(state, obj) {
    const keys = Object.keys(obj)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = obj[key])
  }
}
