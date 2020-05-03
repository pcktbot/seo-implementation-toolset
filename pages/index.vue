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
    <b-container fluid class="px-5">
      <b-row>
        <b-col>
          <b-card no-body class="my-5" style="background-color: WhiteSmoke">
            <b-card-header style="background-color: var(--secondary--lighten2)">
              <h4 class="mb-1 ml-2 font-weight-bold">
                Complete Options Below
              </h4>
            </b-card-header>
            <b-card-body class="py-5">
              <initial-selections />
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <g5-footer />
  </div>
</template>

<script>
import g5Nav from '~/components/nav'
import g5Footer from '~/components/footer'
import initialSelections from '~/components/initial-selections'
import Index from '~/mixins/index'
export default {
  components: {
    g5Nav,
    initialSelections,
    g5Footer
  },
  mixins: [Index],
  data () {
    return {}
  },
  async fetch({ store }) {
    await store.dispatch('userInfo/get')
  },
  methods: {}
}
</script>

<style scoped>

</style>
