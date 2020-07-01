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
                <!-- v-model="filter" -->
                <b-form-input
                  id="filterInput"
                  :value="redirects.filter"
                  @input="setRedirectProp({'filter': $event})"
                  type="search"
                  placeholder="Type to Search"
                />
                <b-input-group-append>
                  <b-button :disabled="!redirects.filter" @click="setRedirectProp({'filter': ''})">
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
              <b-form-checkbox-group
                :value="redirects.filterOn"
                @input="setRedirectProp({'filterOn': $event})"
                class="mt-1"
              >
                <b-form-checkbox
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
                <b-form-select
                  v-model="sortDesc"
                  :disabled="!redirects.sortBy"
                  size="sm"
                  class="w-25"
                >
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
                :value="redirects.perPage"
                @change="setRedirectProp({'perPage': $event})"
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
                :value="redirects.currentPage"
                @change="setRedirectProp({'currentPage': $event})"
                :total-rows="redirects.totalRows"
                :per-page="redirects.perPage"
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
              :current-page="redirects.currentPage"
              :per-page="redirects.perPage"
              :filter="redirects.filter"
              :filterIncludedFields="redirects.filterOn"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="redirects.sortDirection"
              @filtered="onFiltered"
              responsive
              bordered
              show-empty
              small
              stacked="md"
            >
              <template v-slot:cell(strategy)="data" class="align-self-center">
                <b-col
                  style="width:10rem"
                  class="p-0 m-0"
                >
                  <!-- @change="onChangeCell($event, data.index, 'strategy')" -->
                  <b-form-select
                    id="strat-selection"
                    :value="data.value"
                    :options="redirects.options"
                    @change="updateCell($event, data.index, 'strategy')"
                  />
                </b-col>
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
    sortDesc: {
      get() { return this.$store.state.redirectStore.sortDesc },
      set(val) { this.$store.commit('initSelects/SET', { 'sortDesc': val }) }
    },
    sortBy: {
      get() { return this.$store.state.redirectStore.sortBy },
      set(val) { this.$store.commit('initSelects/SET', { 'sortBy': val }) }
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
    },
    updateCell(val, index, label) {
      // eslint-disable-next-line no-console
      console.log(val)
      // eslint-disable-next-line no-console
      console.log(index)
      // eslint-disable-next-line no-console
      console.log(label)
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
