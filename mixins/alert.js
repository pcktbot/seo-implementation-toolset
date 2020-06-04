import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      alertProps: state => state.alert
    })
  },
  methods: {
    ...mapMutations({
      set: 'alert/SET'
    }),
    countDownChanged(dismissCountDown) {
      this.set({ key: 'dismissCountDown', val: dismissCountDown })
    },
    showAlert(msg, variant) {
      this.set({
        dismissCountDown: this.alertProps.dismissSecs,
        alertMsg: msg,
        alertvariant: variant
      })
    }
  }
}
