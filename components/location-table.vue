<template>
  <div>
    <b-row>
      <b-col lg="3" class="p-2">
        <b-form-group
          label="Filter"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filterInput"
              :value="locationtbl.filter"
              @input="setLocationTblProps({'filter': $event})"
              type="search"
              placeholder="Type to Search"
            />
            <b-input-group-append>
              <b-button
                :disabled="!locationtbl.filter"
                @click="setLocationTblProps({'filter': ''})"
              >
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
            :value="locationtbl.filterOn"
            @input="setLocationTblProps({'filterOn': $event})"
            class="mt-1"
          >
            <b-form-checkbox
              v-for="field in getFilteredFields()"
              :key="field.key"
              :value="field.key"
            >
              {{ field.label }}
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>
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
              :disabled="!locationtbl.sortBy"
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
    </b-row>
    <b-row>
      <b-col>
        <b-table
          ref="selectableTable"
          :fields="locationtbl.fields"
          :items="locationtbl.items"
          :select-mode="locationtbl.selectMode"
          :filter="locationtbl.filter"
          :filterIncludedFields="locationtbl.filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="locationtbl.sortDirection"
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
          <template v-slot:cell(phase)="data">
            <b-input
              :id="`phase-${data.item.value}`"
              :value="data.value"
              @input="onChangeCell($event, data.item.value, 'phase')"
              class="phase-input"
            />
          </template>
          <template v-slot:cell(corporate)="data">
            <icons-swap
              :needsCheckIcon="data.value"
              :iconConfig="iconConfig"
            />
          </template>
          <template v-slot:cell(service_level)="data">
            <b-form-select
              :id="`service-${data.item.value}`"
              :value="data.value"
              :options="locationtbl[`${initSelects.selects[0].value}Options`]"
              @input="onChangeCell($event, data.item.value, 'service_level')"
            />
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
  </div>
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
    sortBy: {
      get() { return this.$store.state.locationsTable.sortBy },
      set(val) { this.$store.commit('locationsTable/SET', { 'sortBy': val }) }
    },
    sortDesc: {
      get() { return this.$store.state.locationsTable.sortDesc },
      set(val) { this.$store.commit('locationsTable/SET', { 'sortDesc': val }) }
    },
    sortOptions() {
      // Create an options list from our fields
      return this.locationtbl.fields
        .filter(f => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key }
        })
    },
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
      setLocationProp: 'locations/UPDATE_LOCATION_PROP',
      setLocationNotes: 'notes/SET',
      setLocationTblProps: 'locationsTable/SET',
      setRedirectProp: 'selectedLocation/UPDATE_REDIRECT_PROPERTY',
      setCounter: 'selectedLocation/SET_COUNTER'
    }),
    getFilteredFields() {
      const fields = this.locationtbl.fields.filter((obj) => {
        // eslint-disable-next-line no-console
        console.log(obj.key)
        return obj.key !== 'select' && obj.key !== 'edit'
      })
      return fields
    },
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
      this.initRedirectCounter()
      const locNotes = this.getLocationNotes(this.selectedLocation.id)
      this.setLocationNotes({ 'locationNotes': locNotes })
      this.$store.commit('tabindex/set', 0)
    },
    initRedirectCounter() {
      const redirectItems = this.selectedLocation.properties.redirects.items
      const counterID = this.getLargestRedirectId(redirectItems)
      this.setCounter(counterID)
    },
    getLargestRedirectId(redirectItems) {
      let max = 0
      if (redirectItems.length > 0) {
        max = redirectItems.reduce((prev, current, index) => {
          return prev.id > current.id ? prev.id : current.id
        })
      }
      return max
    },
    onChangeCell(val, locId, key) {
      const locIdx = this.locations.findIndex(item => item.id === locId)
      this.setLocationProp({ val, locIdx, key })
    }
  }
}
</script>

<style>
  .phase-input {
    border: none;
    background-color: transparent;
  }
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
