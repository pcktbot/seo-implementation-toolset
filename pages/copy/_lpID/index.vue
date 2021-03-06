<template>
  <div>
    <g5-nav>
      <template v-slot:alert>
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
      <template v-slot:content>
        <menu-dropdown />
      </template>
    </g5-nav>
    <div class="main-with-nav">
      <b-container fluid class="scroll-container">
        <h1 class="text-center font-weight-bold mb-0 mt-4">
          SEO Liquid Values
        </h1>
        <b-row class="px-4" style="background-color: white">
          <b-col>
            <b-table
              :fields="getHeaders"
              :items="copyTable.items"
              striped
              hover
              bordered
              sticky-header="42rem"
              responsive="true"
              head-variant="light"
              class="self-align-center table mt-3 mb-1"
            >
              <template v-slot:cell(status)="data">
                <icons-swap
                  :needsCheckIcon="data.value"
                  :iconConfig="iconConfig"
                />
              </template>
              <template v-slot:cell(strategy)="data">
                <b-link id="strat-link" :href="getStrategyLink(data.value)" target="_blank">
                  {{ getStrategyText(data.value) }}
                </b-link>
              </template>
            </b-table>
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
import menuDropdown from '~/components/menu-dropdown'
import g5Footer from '~/components/footer'
import Alert from '~/mixins/alert'
import CommentsMixin from '~/mixins/comments'
import IconsSwap from '~/components/icons-swap'
import Strategies from '~/server/config/strategies'
export default {
  components: {
    g5Nav,
    IconsSwap,
    g5Footer,
    menuDropdown
  },
  mixins: [Alert, CommentsMixin],
  data () {
    return {
      iconConfig: {
        width: '28',
        height: '28',
        true: '/green-check.svg',
        false: '/red-x.svg'
      },
      strategies: Strategies
    }
  },
  computed: {
    ...mapState({
      copyTable: state => state.copyTable,
      locations: state => state.locations,
      vertical: state => state.initSelects.selects[0].value
    }),
    getHeaders() {
      return this.vertical === 'mf'
        ? this.copyTable.mfHeaders
        : this.copyTable.otherHeaders
    }
  },
  async fetch({ store, params }) {
    try {
      const lpId = params.lpID
      const selects = await store.dispatch('initSelects/GET', lpId)
      const res = await store.dispatch('locations/GET', { lpId, selects })
      store.commit('copyTable/SET_MAP_ITEMS', res)
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
    getStrategyLink(strategy) {
      const verticalStrategies = Object.keys(this.strategies[this.vertical])
      return strategy && verticalStrategies.includes(strategy)
        ? this.strategies[this.vertical][strategy].link : ''
    },
    getStrategyText(strategy) {
      const verticalStrategies = Object.keys(this.strategies[this.vertical])
      return strategy && verticalStrategies.includes(strategy)
        ? this.strategies[this.vertical][strategy].description : ''
    }
  }
}
</script>

<style scoped>

#strat-link:hover {
  color: var(--tertiary);
}
</style>
