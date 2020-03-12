export default {
  methods: {
    getAll(locationId, lpId) {
      const query = (locationId)
        ? `locationId=${locationId}`
        : `lpId=${lpId}`
      return this.$axios
        .$get(`api/comments?${query}`)
    },
    postComment() {},
    updateComment() {}
  }
}
