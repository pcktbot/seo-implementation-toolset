export const state = () => ({
  fields: [
    'name',
    'recommended_name',
    'street_address_1',
    'city'
  ],
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
  ],
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
  removeFields: {
    multi: {
      mf: ['custom_slug'],
      ss: ['floor_plans', 'property_feature_1', 'custom_slug'],
      sl: ['floor_plans', 'property_feature_1', 'custom_slug']
    },
    single: {
      mf: [],
      ss: ['floor_plans', 'property_feature_1'],
      sl: ['floor_plans', 'property_feature_1']
    }
  }
})

export const actions = {}

export const mutations = {}
