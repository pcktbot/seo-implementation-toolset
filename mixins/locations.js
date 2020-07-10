import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      locations: state => state.locations.locations,
      selectedLocation: state => state.selectedLocation.location,
      locID: state => state.selectedLocation.location.id,
      initSelects: state => state.initSelects
    }),
    locIdx() {
      return this.locations.findIndex(loc => loc.id === this.locID)
    }
  },
  methods: {
    ...mapMutations({
      updateLocProp: 'selectedLocation/UPDATE_PROP',
      updateLocTable: 'locationsTable/SET_ITEM'
    }),
    toTitleCase(str) {
      return str.replace(
        /\w\S*/g,
        (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        }
      )
    },
    onUpdate(obj) {
      this.updateLocProp(obj)
    },
    updateAddress(data) {
      for (const prop in data) {
        this.updateLocProp({
          key: prop,
          val: data[prop]
        })
      }
    },
    updateLocationStatus() {
      const locProp = this.selectedLocation.properties
      const stepsComplete = this.allStepsComple(locProp)
      if (stepsComplete) {
        this.updateLocProp({ key: 'locationComplete', val: true })
        this.updateLocTable({ index: this.locIdx, field: 'status', val: true })
      } else {
        this.updateLocProp({ key: 'locationComplete', val: false })
        this.updateLocTable({ index: this.locIdx, field: 'status', val: false })
      }
    },
    updatePRStatus() {
      const locProp = this.selectedLocation.properties
      this.updateLocTable({ index: this.locIdx, field: 'prstatus', val: locProp.prComplete })
      this.onSave()
    },
    allStepsComple(locProp) {
      return locProp.stepOneComplete &&
        locProp.stepTwoComplete &&
        locProp.stepThreeComplete &&
        locProp.stepFourComplete
    },
    onSave() {
      this.$axios.$put('api/locations', {
        lpId: this.initSelects.lpId,
        locations: this.locations
      })
      this.$axios.$put(`api/lp-project/${this.initSelects.lpId}`, {
        selects: this.initSelects.selects
      })
    }
  }
}
