import Papa from 'papaparse'
export default {
  data () {
    return {
      form: {
        inputs: {
          lpId: null,
          file: null
        },
        loading: false,
        alertMsg: '',
        alertvariant: '',
        dismissSecs: 5,
        dismissCountDown: 0,
        existingLPMsg: 'There is already a LP project under this ID. To add additional locations, load the LP project',
        successLoadMsg: 'Successfully loaded locations',
        errLoadMsg: 'Error loading location/s, check to ensure the url is using the correct LP ID',
        csvSuccessMsg: 'Your new location/s have beeen successfully added, please select a location below',
        csvErrMsg: 'There was an error uploading the csv',
        selects: [
          {
            id: 'vertical',
            value: null,
            options: [
              { value: null, text: 'Select Vertical' },
              { value: 'mf', text: 'Multi-Family' },
              { value: 'ss', text: 'Self Storage' },
              { value: 'sl', text: 'Senior Living' }
            ]
          },
          {
            id: 'domain',
            value: null,
            options: [
              { value: null, text: 'Select Domain Strategy' },
              { value: 'multi', text: 'Multi Domain' },
              { value: 'single', text: 'Single Domain' }
            ]
          },
          {
            id: 'branding',
            value: null,
            options: [
              { value: null, text: 'Select Chain Branding' },
              { value: 'yes', text: 'Yes' },
              { value: 'no', text: 'No' }
            ]
          }
        ]
      }
    }
  },
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
        amenity_phrases: '',
        locationNote: ''
      }
    },
    /**
     * Downloads csv from URL
     * @param {String} csvurl
     */
    downloadCSV(csvurl) {
      const link = document.createElement('a')
      link.href = csvurl
      link.setAttribute('download', 'location-export.csv')
      document.body.appendChild(link)
      link.click()
    },
    generateCSV(arr) {
      const unparsedcsv = Papa.unparse(arr)
      const file = new Blob([unparsedcsv], { type: 'text/csv' })
      return URL.createObjectURL(file)
    },
    excludedExportProp() {
      const addProp = ['neighborhood_keywords', 'landmark_keywords', 'amenity_keywords', 'class', 'primary_type', 'current_website', 'negative_keywords']
      return Object.keys(this.getAddPropFields()).concat(addProp)
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
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert(msg, variant) {
      this.form.dismissCountDown = this.form.dismissSecs
      this.form.alertMsg = msg
      this.form.alertvariant = variant
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
