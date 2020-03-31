export default {
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
    updateComment() {}
  }
}
