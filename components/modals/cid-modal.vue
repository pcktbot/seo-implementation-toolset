<template>
  <b-modal
    id="cid-modal"
    :hide-footer="hidden"
    header-bg-variant="primary"
    size="xl"
    title="Location GMB CID"
  >
    <b-container fluid>
      <b-row class="mb-1 text-left">
        <b-col>
          <b-card class="h-100">
            <h5>Select a Business</h5>
            <hr>
            <b-table
              :fields="gmbStore.fields"
              :items="gmbStore.res"
              @row-selected="onRowSelected($event, 'cidTbl')"
              selectable
              select-mode="single"
              class="cid-table self-align-center"
              responsive
              hover
            >
              <template v-slot:cell(select)="{ rowSelected }">
                <icons-swap
                  :needsCheckIcon="rowSelected"
                  :iconConfig="gmbStore.iconCheckConfig"
                />
              </template>
              <template v-slot:cell(url)="data">
                <b-link :href="data.value" target="_blank">
                  <b-img src="/maps-icon.svg" class="maps-icon jello-vertical social-link" />
                </b-link>
              </template>
            </b-table>
            <b-button
              @click="updateData"
              :disabled="gmbStore.res === null || gmbStore.selected.length === 0"
              variant="secondary"
              class="text-center"
            >
              Apply CID
            </b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Locations from '~/mixins/locations'
import TableMethods from '~/mixins/tableMethods'
import IconsSwap from '~/components/icons-swap'
export default {
  components: {
    IconsSwap
  },
  mixins: [Locations, TableMethods],
  data () {
    return {
      hidden: true
    }
  },
  computed: {
    ...mapState({
      gmbStore: state => state.gmb
    })
  },
  methods: {
    ...mapMutations({
      updateLocProp: 'selectedLocation/UPDATE_PROP'
    }),
    hide() {
      this.$bvModal.hide('cid-modal')
    },
    updateData() {
      const cid = this.gmbStore.selected[0].cid
      this.updateLocProp({ key: 'google_cid', val: cid })
      this.onRowSelected([], 'cidTbl')
      this.hide()
    }
  }
}
</script>

<style>
  footer {
    margin-top: 0em;
  }

  .cid-table td {
    padding-left: 12px;
  }

  .social-link {
     width: 20px;
     height: 20px;
     position: relative;
     bottom: 3px;
  }
</style>
