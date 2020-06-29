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
      <b-container fluid class="scroll-container redirects">
        <h1 class="text-center font-weight-bold mb-0 mt-4">
          Redirects
        </h1>
        <b-row class="px-4">
          <b-col lg="6" class="p-2">
            <b-form-group
              label="Filter"
              label-size="sm"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  id="filterInput"
                  v-model="filter"
                  type="search"
                  placeholder="Type to Search"
                />
                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''">
                    Clear
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col lg="6" class="p-2">
            <b-form-group
              label="Filter On *Leave all unchecked to filter on all data"
              label-size="sm"
              class="mb-0 pt-2"
            >
              <b-form-checkbox-group class="mt-1">
                <b-form-checkbox
                  v-model="filterOn"
                  v-for="field in redirects.fields"
                  :key="field.key"
                  :value="field.key"
                >
                  {{ field.label }}
                </b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="px-4">
          <b-col lg="3" class="p-2">
            <b-form-group
              label="Sort"
              label-size="sm"
              label-for="sortBySelect"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-select
                  id="sortBySelect"
                  v-model="sortBy"
                  :options="sortOptions"
                >
                  <template v-slot:first>
                    <option value="">
                      -- none --
                    </option>
                  </template>
                </b-form-select>
                <b-form-select v-model="sortDesc" :disabled="!sortBy" size="sm" class="w-25">
                  <option :value="false">
                    Asc
                  </option>
                  <option :value="true">
                    Desc
                  </option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col lg="3" class="p-2 w-50">
            <b-form-group
              label="Per page"
              label-size="sm"
              label-for="perPageSelect"
              class="mb-0"
            >
              <b-form-select
                id="perPageSelect"
                v-model="perPage"
                :options="redirects.pageOptions"
                size="sm"
              />
            </b-form-group>
          </b-col>
          <b-col lg="6" class="p-2">
            <b-form-group
              label="Pick Page"
              label-size="sm"
              label-for="paginationComponent"
              class="mb-0"
            >
              <b-pagination
                id="paginationComponent"
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="fill"
                size="sm"
                class="my-0"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="px-4" style="background-color: white">
          <b-col>
            <b-table
              :items="redirects.items"
              :fields="redirects.fields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="filter"
              :filterIncludedFields="filterOn"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="sortDirection"
              @filtered="onFiltered"
              responsive
              bordered
              show-empty
              small
              stacked="md"
            />
          </b-col>
        </b-row>
      </b-container>
    </div>
    <g5-footer />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import g5Nav from '~/components/nav'
import menuDropdown from '~/components/menu-dropdown'
import g5Footer from '~/components/footer'
import Alert from '~/mixins/alert'
// import IconsSwap from '~/components/icons-swap'
export default {
  components: {
    g5Nav,
    // IconsSwap,
    g5Footer,
    menuDropdown
  },
  mixins: [Alert],
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      redirects: state => state.redirectStore,
      locations: state => state.locations,
      vertical: state => state.initSelects.selects[0].value,
      lpId: state => state.initSelects.lpId
    }),
    sortBy: {
      get() { return this.$store.state.redirectStore.sortBy },
      set(val) { this.$store.commit('redirectStore/SET', { 'sortBy': val }) }
    },
    sortDesc: {
      get() { return this.$store.state.redirectStore.sortDesc },
      set(val) { this.$store.commit('redirectStore/SET', { 'sortDesc': val }) }
    },
    filter: {
      get() { return this.$store.state.redirectStore.filter },
      set(val) { this.$store.commit('redirectStore/SET', { 'filter': val }) }
    },
    filterOn: {
      get() { return this.$store.state.redirectStore.filterOn },
      set(val) { this.$store.commit('redirectStore/SET', { 'filterOn': val }) }
    },
    sortDirection: {
      get() { return this.$store.state.redirectStore.sortDirection },
      set(val) { this.$store.commit('redirectStore/SET', { 'sortDirection': val }) }
    },
    currentPage: {
      get() { return this.$store.state.redirectStore.currentPage },
      set(val) { this.$store.commit('redirectStore/SET', { 'currentPage': val }) }
    },
    perPage: {
      get() { return this.$store.state.redirectStore.perPage },
      set(val) { this.$store.commit('redirectStore/SET', { 'perPage': val }) }
    },
    totalRows: {
      get() { return this.$store.state.redirectStore.totalRows },
      set(val) { this.$store.commit('redirectStore/SET', { 'totalRows': val }) }
    },
    sortOptions() {
      // Create an options list from our fields
      return this.redirects.fields
        .filter(f => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key }
        })
    }
  },
  async fetch({ store, params }) {
    try {
      await store.dispatch('initSelects/GET', params.lpID)
      const res = await store.dispatch('locations/GET', params.lpID)
      store.commit('redirectStore/SET_MAP_ITEMS', res)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  },
  created() {
    this.locations.locations.length > 0
      ? this.showAlert(this.alertProps.successLoadRedirects, 'success')
      : this.showAlert(this.alertProps.errLoadMsg, 'danger')
  },
  methods: {
    ...mapMutations({
      setRedirectProp: 'redirectStore/SET'
    }),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
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
  #strat-link:hover {
    color: var(--tertiary);
  }
</style>
