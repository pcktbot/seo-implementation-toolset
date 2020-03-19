import Papa from 'papaparse'
export default {
  methods: {
    getAddPropFields() {
      return {
        population: null,
        uspsvalid: null,
        recommended_name: null,
        redirects: {
          fields: [
            {
              key: 'strategy',
              label: 'Strategy'
            },
            {
              key: 'current_url',
              label: 'Current URL',
              sortable: true
            },
            {
              key: 'formatted_url',
              label: 'Formatted URL',
              sortable: true
            },
            {
              key: 'select',
              label: 'Select'
            }
          ],
          items: [],
          selected: []
        },
        redirecttext: '',
        redirectstrat: null,
        stepOneComplete: false,
        stepTwoComplete: false,
        stepThreeComplete: false,
        stepFourComplete: false,
        locationComplete: false,
        prComplete: false,
        gmb: null,
        ga: null,
        strategy: null,
        api_neighborhood_keywords: '',
        api_landmark_keywords: '',
        neighborhood_phrases: '',
        landmark_phrases: '',
        amenity_phrases: ''
      }
    },
    updateSelect({ key, val }) {
      const i = this.form.selects.findIndex(select => select.id === key)
      this.form.selects[i].value = val
    },
    updateInput({ key, val }) {
      (key === 'file')
        ? this.form.inputs[key] = [val]
        : this.form.inputs[key] = val
    },
    reject(obj, keys) {
      const vkeys = Object.keys(obj)
        .filter(k => !keys.includes(k))
      return this.pick(obj, vkeys)
    },
    pick(obj, keys) {
      return keys.map(k => k in obj ? { [k]: obj[k] } : {})
        .reduce((res, o) => Object.assign(res, o), {})
    },
    setMsgConfig(msg, variant, msgOn) {
      this.form.msg = msg
      this.form.alertvariant = variant
      this.form.showMsg = msgOn
    },
    parseCSV(file) {
      return new Promise((resolve) => {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            resolve(results.data)
          }
        })
      })
    },
    getLocationData(data) {
      return data[0].name ? data.map((location) => {
        const { name } = location
        const properties = this.reject(location, ['name'])
        const addPropertyFields = this.getAddPropFields()
        for (const prop in addPropertyFields) {
          properties[prop] = addPropertyFields[prop]
        }
        return { name, properties }
      }).filter(location => location.name) : []
    }
  }
}
