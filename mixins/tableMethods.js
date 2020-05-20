import { mapMutations } from 'vuex'
export default {
  computed: {
  },
  methods: {
    ...mapMutations({
      setSelected: 'locationsTable/SET_SELECTED',
      selectRedirectsTbl: 'selectedLocation/SET_SELECTED'
    }),
    onRowSelected(items, tblname) {
      if (tblname === 'locationtbl') {
        this.setSelected(items)
      } else {
        this.selectRedirectsTbl({ val: items })
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
