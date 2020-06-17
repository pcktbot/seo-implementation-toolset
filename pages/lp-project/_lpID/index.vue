<template>
  <div>
    <g5-nav>
      <template v-slot:alert>
        <b-alert
          :show="alertProps.dismissCountDown"
          :variant="alertProps.alertvariant"
          @dismiss-count-down="countDownChanged"
          @dismissed="set({alertMsg: '',alertvariant: '', dismissCountDown: 0})"
          class="mb-0"
          dismissible
          fade
        >
          {{ alertProps.alertMsg }}
        </b-alert>
      </template>
      <template v-slot:content>
        <b-nav-item
          :href="`/copy/${lpId}`"
        >
          <h5 class="text-white mb-0 pb-0">
            SEO Liquid Values
          </h5>
        </b-nav-item>
      </template>
    </g5-nav>
    <div class="main-with-nav">
      <drawer>
        <template v-slot:button-text>
          <b-icon icon="chat-fill" variant="primary" class="jello-vertical" />
        </template>
        <template v-slot:content>
          <notes />
        </template>
      </drawer>
      <b-container fluid class="scroll-container">
        <b-row class="pt-4 px-5" style="background-color: Gainsboro">
          <b-col>
            <initial-selections />
          </b-col>
        </b-row>
        <accordion-toggle />
        <b-row class="px-5" style="background-color: white">
          <b-col>
            <location-table />
          </b-col>
        </b-row>
        <b-row v-if="selectedLocation && completedDropDowns" class="px-5 pt-3 pb-4" style="background-color: var(--secondary--lighten3)">
          <b-col class="px-0">
            <form-stepper />
          </b-col>
        </b-row>
      </b-container>
    </div>
    <g5-footer />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import g5Nav from '~/components/nav'
import Drawer from '~/components/drawer'
import Notes from '~/components/notes'
import initialSelections from '~/components/initial-selections'
import AccordionToggle from '~/components/accordion-toggle'
import LocationTable from '~/components/location-table'
import FormStepper from '~/components/form-stepper'
import g5Footer from '~/components/footer'
import Alert from '~/mixins/alert'
import CommentsMixin from '~/mixins/comments'

export default {
  components: {
    g5Nav,
    Drawer,
    Notes,
    initialSelections,
    AccordionToggle,
    LocationTable,
    FormStepper,
    g5Footer
  },
  mixins: [Alert, CommentsMixin],
  data () {
    return {}
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      locationtbl: state => state.locationsTable,
      selectedLocation: state => state.selectedLocation.location,
      initSelects: state => state.initSelects.selects,
      lpId: state => state.initSelects.lpId
    }),
    completedDropDowns() {
      let valid = true
      for (let i = 0; i < this.initSelects.length; i++) {
        if (!this.initSelects[i].value) {
          valid = false
          break
        }
      }
      return valid
    }
  },
  async fetch({ store, params }) {
    try {
      store.dispatch('userInfo/GET')
      store.dispatch('initSelects/GET', params.lpID)
      store.commit('initSelects/SET', { 'visible': false })
      store.dispatch('notes/GET_AND_SET', params.lpID)
      const res = await store.dispatch('locations/GET', params.lpID)
      store.commit('locationsTable/SET_MAP_ITEMS', res)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  },
  created() {
    this.locationtbl.items.length > 0
      ? this.showAlert(this.alertProps.successLoadMsg, 'success')
      : this.showAlert(this.alertProps.errLoadMsg, 'danger')
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
