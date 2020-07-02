<template>
  <b-row>
    <b-col>
      <b-table
        ref="selectableTable"
        :fields="locationtbl.fields"
        :items="locationtbl.items"
        :select-mode="locationtbl.selectMode"
        @row-selected="onRowSelected($event, 'locationtbl')"
        selectable
        sticky-header="20rem"
        responsive="true"
        striped
        hover
        head-variant="light"
        bordered
        class="self-align-center table mt-3 mb-1"
      >
        <template v-slot:cell(select)="{ rowSelected }">
          <icons-swap
            :needsCheckIcon="rowSelected"
            :iconConfig="iconCheckConfig"
          />
        </template>
        <template v-slot:cell(location)="data">
          {{ data.value }}
        </template>
        <template v-slot:cell(edit)="data">
          <b-btn
            :disabled="disabled"
            @click="loadLocation(data.item.value)"
            href="#loctable"
            variant="outline-secondary"
            class="px-4"
            size="sm"
            block
            style="font-size: 1rem; align-items: center;"
          >
            Edit
            <b-icon style="position: relative; bottom: 2px;" icon="pencil" />
          </b-btn>
        </template>
        <template v-slot:cell(status)="data">
          <icons-swap
            :needsCheckIcon="data.value"
            :iconConfig="iconConfig"
          />
        </template>
        <template v-slot:cell(prstatus)="data">
          <icons-swap
            :needsCheckIcon="data.value"
            :iconConfig="iconConfig"
          />
        </template>
      </b-table>
      <b-row class="table-btns ml-0 mr-0">
        <b-col class="col-12 col-md-4 col-lg">
          <b-button @click="selectAllRows('selectableTable')" block>
            Select all
          </b-button>
        </b-col>
        <b-col class="col-12 col-md-4 col-lg">
          <b-button @click="clearSelected('selectableTable')" block>
            Clear Selected
          </b-button>
        </b-col>
        <b-col class="col-12 col-md-4 col-lg">
          <b-button @click="exportSelected" block>
            Export Selected
            <b-icon style="position: relative; bottom: 1px;" icon="download" />
          </b-button>
        </b-col>
        <b-col class="col-12 col-md-6 col-lg">
          <b-button @click="save" block>
            Save All
            <b-img src="/save-icon.svg" width="18" height="18" style="position: relative; bottom: 2px;" />
          </b-button>
        </b-col>
        <b-col class="col-12 col-md-6 col-lg">
          <b-button v-b-modal.modal-1 variant="danger" block>
            Delete Selected
            <b-icon style="position: relative; bottom: 2px;" icon="trash" width="20" height="20" />
          </b-button>
        </b-col>
      </b-row>
      <b-modal
        id="modal-1"
        @ok="onDelete"
        header-bg-variant="primary"
        title="Delete Location"
      >
        <p class="my-4">
          {{ msg }}
        </p>
      </b-modal>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Alert from '~/mixins/alert'
import Export from '~/mixins/export'
import Locations from '~/mixins/locations'
import TableMethods from '~/mixins/tableMethods'
import Comments from '~/mixins/comments'
import IconsSwap from '~/components/icons-swap'
export default {
  components: {
    IconsSwap
  },
  mixins: [Alert, Locations, Export, TableMethods, Comments],
  data () {
    return {
      iconConfig: {
        width: '28',
        height: '28',
        true: '/green-check.svg',
        false: '/red-x.svg'
      },
      iconCheckConfig: {
        width: '28',
        height: '28',
        true: '/check-box.svg',
        false: '/square.svg'
      }
    }
  },
  computed: {
    ...mapState({
      initSelects: state => state.initSelects,
      locations: state => state.locations.locations,
      locationtbl: state => state.locationsTable,
      selectedLocation: state => state.selectedLocation.location
    }),
    disabled() {
      const selects = this.initSelects.selects
      return !(selects[0].value && selects[1].value && selects[2].value)
    },
    msg() {
      return this.locationtbl.selected.length > 0
        ? 'Are you sure you want to delete these locations? This is permanent..'
        : 'Please select location/s to delete'
    }
  },
  methods: {
    ...mapMutations({
      setLocation: 'selectedLocation/SET',
      setLocations: 'locations/SET',
      setLocationNotes: 'notes/SET',
      setLocationTblProps: 'locationsTable/SET',
      setRedirectProp: 'selectedLocation/UPDATE_REDIRECT_PROPERTY',
      setCounter: 'selectedLocation/SET_COUNTER'
    }),
    save() {
      this.onSave()
      if (this.selectedLocation) { this.updateLocationStatus() }
      this.showAlert('Saved', 'success')
    },
    selectedLocationsComplete() {
      let val = true
      const selected = this.locationtbl.selected
      for (let i = 0; i < selected.length; i++) {
        if (selected[i].status === false) {
          val = false
          break
        }
      }
      return val
    },
    exportSelected() {
      if (this.locationtbl.selected.length > 0) {
        if (this.selectedLocationsComplete()) {
          this.exportLocations()
        } else {
          this.showAlert('Unselect incomplete locations', 'danger')
        }
      } else { this.showAlert('Select a location/s', 'danger') }
    },
    onDelete() {
      const locIDs = this.getSelectedLocationIds()
      if (locIDs) {
        locIDs.forEach((locID) => {
          const filteredLocations = this.locations.filter(location => location.id !== locID || null)
          this.setLocations(filteredLocations) // update store locations
          this.setLocation(null) // update selectedLoc in store
          this.$axios.delete(`/api/lp-project/${this.initSelects.lpId}/${locID}`)
          this.$axios.delete(`/api/comments/?locationId=${locID}`)
          const tableLocations = this.locationtbl.items.filter(location => location.value !== locID || null)
          this.setLocationTblProps({ 'items': tableLocations, 'selected': [] }) // update locTable in store
        })
      }
    },
    loadLocation(payload) {
      const selectLoc = this.locations.filter(location => location.id === payload)[0]
      this.setLocation(selectLoc)
      this.configRedirectIds()
      const locNotes = this.getLocationNotes(this.selectedLocation.id)
      this.setLocationNotes({ 'locationNotes': locNotes })
      this.$store.commit('tabindex/set', 0)
    },
    configRedirectIds() {
      const redirectItems = this.selectedLocation.properties.redirects.items
      // no redirect ids
      if (redirectItems.length > 0 && redirectItems[0].id === undefined) {
        this.setRedirectIDs(redirectItems)
      } else {
        // eslint-disable-next-line no-console
        console.log('madeit')
        this.setLargestRedirectId(redirectItems)
      }
    },
    setRedirectIDs(redirectItems) {
      redirectItems.forEach((redirect, idx) => {
        this.setRedirectProp({
          key: 'id',
          index: idx
        })
      })
      this.setCounter(redirectItems.length)
    },
    setLargestRedirectId(redirectItems) {
      let max = 0
      if (redirectItems.length > 0) {
        max = redirectItems.reduce((prev, current, index) => {
          return prev.id > current.id ? prev : current
        })
        max = max.id
      }
      this.setCounter(max)
    }
  }
}
</script>

<style>
  .table td {
    padding: .4em;
  }
  .table thead th {
    padding-top: 1em;
    padding-bottom: 1em;
  }
  tbody {
    margin-bottom: 5em;
  }
  .table th, .table td {
    vertical-align: middle;
  }
  .bottom-btns .btn-sm {
    margin-top: .25rem;
  }
  .table-btns .col, .table-btns .col-md-4, .table-btns .col-md-6, .table-btns .col-lg {
    padding-left: .25rem;
    padding-right: .25rem;
  }
  .alert-row .alert-dismissible .close {
    padding: .2rem 1.25rem;
}
</style>
