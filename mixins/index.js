import Papa from 'papaparse'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      propertiesToString: [ // in exportData store
        'neighborhood',
        'neighborhood_2',
        'landmark_1_name',
        'apartment_amenity_1',
        'community_amenity_1'
      ]
    }
  },
  computed: {
    ...mapState({
      alertProps: state => state.alert
    })
  },
  methods: {
    ...mapMutations({
      set: 'alert/SET'
    }),
    countDownChanged(dismissCountDown) {
      this.set({ key: 'dismissCountDown', val: dismissCountDown })
    },
    showAlert(msg, variant) {
      this.set({
        dismissCountDown: this.alertProps.dismissSecs,
        alertMsg: msg,
        alertvariant: variant
      })
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
    }
  }
}
