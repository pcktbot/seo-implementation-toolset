import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      allNotes: state => state.notes.allNotes
    })
  },
  methods: {
    getAllNotes(lpId, locationId) {
      const query = (locationId)
        ? `locationId=${locationId}`
        : `lpId=${lpId}`
      return this.$axios
        .$get(`api/comments?${query}`)
    },
    postComment(comment) {
      const { author, lpId, locationId, text } = comment
      return this.$axios
        .$post('api/comments', {
          author,
          lpId,
          locationId,
          text
        })
    },
    getLocationNotes(id) {
      return this.allNotes.filter(note => note.locationId === id)
    },
    updateComment() {}
  }
}
