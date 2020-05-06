import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      locations: state => state.locations.locations,
      selectedLocation: state => state.selectedLocation.location,
      locationtbl: state => state.locationsTable,
      initSelects: state => state.initSelects
    })
  },
  methods: {
    ...mapMutations({
      updateLocProp: 'locations/UPDATE_PROP',
      updateLocTable: 'locationTable/SET_ITEM'
    }),
    onUpdate(obj) {
      this.updateLocProp(obj)
      const { id } = obj
      const locIndex = this.getLocationIndex(id)
      this.updateLocationStatus(locIndex, id)
      this.updatePRLocationStatus(locIndex, id)
    },
    getLocationIndex(id) {
      return this.locations.findIndex(loc => loc.id === id)
    },
    updateLocationStatus(idx, locId) {
      const locProp = this.selectedLocation.properties
      const stepsComplete = this.allStepsComple(locProp)
      if (stepsComplete) {
        this.updateLocProp({ key: 'locationComplete', val: true, id: locId })
        // this.locations[i].properties.locationComplete = true
        this.updateLocTable({ index: idx, field: 'status', val: true })
        // this.locationtbl.items[idx].status = true
      } else {
        this.updateLocProp({ key: 'locationComplete', val: false, id: locId })
        // this.locations[i].properties.locationComplete = false
        this.updateLocTable({ index: idx, field: 'status', val: false })
        // this.locationtbl.items[idx].status = false
      }
    },
    updatePRLocationStatus(idx, locId) {
      const locProp = this.selectedLocation.properties
      this.updateLocTable({ index: idx, field: 'prstatus', val: locProp.prComplete })
      // this.locationtbl.items[idx].prstatus = locProp.prComplete
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
