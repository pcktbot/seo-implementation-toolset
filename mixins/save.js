import { mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      locations: state => state.locations.locations,
      initSelects: state => state.initSelects
    })
  },
  methods: {
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
