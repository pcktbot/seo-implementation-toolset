import Papa from 'papaparse'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      propertiesToString: [
        'neighborhood',
        'neighborhood_2',
        'landmark_1_name',
        'apartment_amenity_1',
        'apartment_amenity_2',
        'apartment_amenity_3',
        'community_amenity_1',
        'community_amenity_2',
        'community_amenity_3'
      ]
    }
  },
  computed: {
    ...mapState({
      exportData: state => state.export,
      locationtbl: state => state.locationsTable,
      locations: state => state.locations.locations,
      addPropFields: state => state.addImportProps
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
      const addProp = ['neighborhood_keywords', 'landmark_keywords', 'amenity_keywords', 'comm_amenity_keywords', 'class', 'primary_type', 'current_website', 'negative_keywords']
      return Object.keys(this.addPropFields).concat(addProp)
    },
    getSelectedLocationIds() {
      return this.locationtbl.selected
        ? this.locationtbl.selected.map(selected => selected.value)
        : null
    },
    exportLocations() {
      const locIDs = this.getSelectedLocationIds()
      if (locIDs) {
        const selectedLocations = []
        this.locations.forEach((location) => {
          const formattedLoc = {}
          if (locIDs.includes(location.id)) {
            const entries = Object.entries(location.properties)
            const filterVal = this.excludedExportProp()
            formattedLoc.name = location.name
            for (const [key, val] of entries) {
              if (!filterVal.includes(key)) {
                if (this.propertiesToString.includes(key) && val.length > 0) {
                  formattedLoc[key] = val[0].name
                } else {
                  formattedLoc[key] = val
                }
              }
            }
            selectedLocations.push(formattedLoc)
          }
        })
        const csvurl = this.generateCSV(selectedLocations)
        this.downloadCSV(csvurl)
      }
    }
  }
}
