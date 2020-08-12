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
      mf: {
        basic: ['custom_slug', 'recommended_name', 'population', 'floor_plans', 'property_feature_1'],
        professional: ['custom_slug', 'recommended_name', 'population', 'floor_plans', 'property_feature_1'],
        elite: ['custom_slug', 'recommended_name']
      },
      ss: {
        starter: ['floor_plans', 'property_feature_1', 'custom_slug', 'recommended_name', 'population'],
        professional: ['floor_plans', 'property_feature_1', 'custom_slug', 'recommended_name', 'population'],
        elite: ['floor_plans', 'property_feature_1', 'custom_slug', 'recommended_name']
      },
      sl: {
        affordable: ['floor_plans', 'property_feature_1', 'custom_slug', 'recommended_name', 'population'],
        enterprise: ['floor_plans', 'property_feature_1', 'custom_slug', 'recommended_name']
      }
    },
    single: {
      mf: {
        basic: ['recommended_name', 'population', 'floor_plans', 'property_feature_1'],
        professional: ['recommended_name', 'population', 'floor_plans', 'property_feature_1'],
        elite: ['recommended_name']
      },
      ss: {
        starter: ['floor_plans', 'property_feature_1', 'recommended_name', 'population'],
        professional: ['floor_plans', 'property_feature_1', 'recommended_name', 'population'],
        elite: ['floor_plans', 'property_feature_1', 'recommended_name']
      },
      sl: {
        affordable: ['floor_plans', 'property_feature_1', 'recommended_name', 'population'],
        enterprise: ['floor_plans', 'property_feature_1', 'recommended_name']
      }
    }
  },
  corpExcludedFields: [
    'floor_plans',
    'property_feature_1',
    'recommended_name',
    'uspsvalid',
    'population'
  ]
})

export const actions = {}

export const mutations = {
  SET(state, obj) {
    const keys = Object.keys(obj)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = obj[key])
  }
}
