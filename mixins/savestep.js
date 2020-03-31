export default {
  methods: {
    onSave(key) {
      // eslint-disable-next-line no-console
      console.log(key)
      this.saveTxt = 'Saved!'
      this.$emit('step-save')
      // eslint-disable-next-line no-return-assign
      setTimeout(() => this.saveTxt = 'Save', 3000)
      this.$emit('step-update', { key, val: true, id: this.location.id })
    }
  }
}
