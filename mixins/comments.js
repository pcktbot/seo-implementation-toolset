export default {
  methods: {
    getAll(lpId, locationId) {
      const query = (locationId)
        ? `locationId=${locationId}`
        : `lpId=${lpId}`
      return this.$axios
        .$get(`api/comments?${query}`)
    },
    postComment(comment) {
      const { author, lpId, locationId, text } = comment
      // eslint-disable-next-line no-console
      console.log(locationId)
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
