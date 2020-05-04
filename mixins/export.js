import Papa from 'papaparse'
import { mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      exportData: state => state.export
    })
  },
  methods: {
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
