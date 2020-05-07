import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({
      locations: state => state.locations,
      locationsTable: state => state.locationsTable,
      selectedLocation: state => state.selectedLocation
    })
  },
  methods: {
    ...mapMutations({
      setSelected: 'locationsTable/SET_SELECTED',
      selectRedirectsTbl: 'locationsTable/UPDATE_THREE_LAYERS'
    }),
    onRowSelected(items, tblname) {
      if (tblname === 'locationtbl') {
        this.setSelected(items)
      } else {
        const i = this.locations.findIndex(loc => loc.id === this.selectedLocation.id)
        this.selectRedirectsTbl({ key1: i, key2: 'properties', key3: 'redirects', key4: 'selected', val: items })
        // this.locations[i].properties.redirects.selected = items
      }
    },
    selectAllRows(tableRef) {
      this.$refs[tableRef].selectAllRows()
    },
    clearSelected(tableRef) {
      this.$refs[tableRef].clearSelected()
    }
  }
}
