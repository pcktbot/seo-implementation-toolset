<template>
  <div>
    <g5-nav>
      <template v-slot:content>
        <b-alert
          :show="alertProps.dismissCountDown"
          :variant="alertProps.alertvariant"
          @dismiss-count-down="countDownChanged"
          @dismissed="set({alertMsg: '',alertvariant: '', dismissCountDown: 0})"
          dismissible
          fade
        >
          {{ alertProps.alertMsg }}
        </b-alert>
      </template>
    </g5-nav>
    <div class="main-with-nav">
      <b-container fluid class="scroll-container">
        <h1 class="text-center font-weight-bold mb-0 mt-4">
          Redirects
        </h1>
        <b-row class="px-4" style="background-color: white">
          <b-col />
          <!-- table will go here -->
        </b-row>
      </b-container>
    </div>
    <g5-footer />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import g5Nav from '~/components/nav'
import g5Footer from '~/components/footer'
import Alert from '~/mixins/alert'
// import IconsSwap from '~/components/icons-swap'
export default {
  components: {
    g5Nav,
    // IconsSwap,
    g5Footer
  },
  mixins: [Alert],
  data () {
    // in redirect store
  },
  computed: {
    ...mapState({
      locations: state => state.locations,
      redirectStore: state => state.redirectStore
    }),
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key }
        })
    }
  },
  async fetch({ store, params }) {
    try {
      // fills in redirect store data for table
      const res = await store.dispatch('locations/GET', params.lpID)
      store.commit('redirectStore/SET_MAP_ITEMS', res)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  },
  created() {
    this.locations.locations.length > 0
      ? this.showAlert(this.alertProps.successLoadMsg, 'success')
      : this.showAlert(this.alertProps.errLoadMsg, 'danger')
  },
  methods: {
    ...mapMutations({
      setRedirectProp: 'redirectStore/SET'
    }),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.setRedirectProp({ 'totalRows': filteredItems.length })
      this.setRedirectProp({ 'currentPage': 1 })
      // this.totalRows = filteredItems.length
      // this.currentPage = 1
    }
  }
}
</script>

<style scoped>

.main-with-nav {
    position: fixed;
    top:5rem;
    left: 0;
    right: 0;
    bottom: 30px;
}
.scroll-container {
    overflow-y: scroll;
    height: 100%;
    scroll-behavior: smooth
}

</style>
