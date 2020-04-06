<template>
  <b-row>
    <b-col>
      <b-table
        ref="selectableTable"
        :fields="locationtbl.fields"
        :items="locationtbl.items"
        :select-mode="locationtbl.selectMode"
        @row-selected="onRowSelected"
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
          <template v-if="rowSelected">
            <b-icon class="h3 mb-0" icon="check" variant="success" />
          </template>
          <template v-else>
            <b-icon class="h4 mb-0" icon="square" />
          </template>
        </template>
        <template v-slot:cell(location)="data">
          {{ data.value }}
        </template>
        <template v-slot:cell(edit)="data">
          <b-btn
            :disabled="disabled"
            @click="loadLocation(data.index)"
            href="#loctable"
            variant="outline-secondary"
            class="px-4"
            size="sm"
            block
          >
            Edit
          </b-btn>
        </template>
        <template v-slot:cell(status)="data">
          <template v-if="data.value === true">
            <b-icon class="h3 mb-0" icon="check-circle" variant="success" />
          </template>
          <template v-else>
            <b-icon class="h3 mb-0" icon="x-circle" variant="danger" />
          </template>
        </template>
        <template v-slot:cell(prstatus)="data">
          <template v-if="data.value === true">
            <b-icon class="h3 mb-0" icon="check-circle" variant="success" />
          </template>
          <template v-else>
            <b-icon class="h3 mb-0" icon="x-circle" variant="danger" />
          </template>
        </template>
      </b-table>
      <b-row class="table-btns ml-0 mr-0">
        <b-col class="col-12 col-md-4 col-lg">
          <b-button @click="selectAllRows" block>
            Select all
          </b-button>
        </b-col>
        <b-col class="col-12 col-md-4 col-lg">
          <b-button @click="clearSelected" block>
            Clear Selected
          </b-button>
        </b-col>
        <b-col class="col-12 col-md-4 col-lg">
          <b-button @click="exportSelected" block>
            Export Selected
            <b-icon icon="download" />
          </b-button>
        </b-col>
        <b-col class="col-12 col-md-6 col-lg">
          <b-button @click="onSave" block>
            Save All
          </b-button>
        </b-col>
        <b-col class="col-12 col-md-6 col-lg">
          <b-button v-b-modal.modal-1 variant="danger" block>
            Delete Selected
            <b-icon icon="trash" />
          </b-button>
        </b-col>
      </b-row>
      <b-row class="alert-row m-0">
        <b-col class="p-0 m-0">
          <b-alert
            :show="dismissCountDown"
            :variant="alertvariant"
            @dismiss-count-down="countDownChanged"
            @dismissed="alertvariant='', alertMsg=''"
            dismissible
            fade
            class="mb-0 py-1"
          >
            {{ alertMsg }}
          </b-alert>
        </b-col>
      </b-row>
      <b-modal
        id="modal-1"
        @ok="onDelete"
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
export default {
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    locationtbl: {
      type: Object,
      default() {
        return {}
      }
    },
    selectedLocation: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      alertMsg: '',
      alertvariant: '',
      dismissSecs: 4,
      dismissCountDown: 0
    }
  },
  computed: {
    disabled() {
      const selects = this.form.selects
      return !(selects[0].value && selects[1].value && selects[2].value)
    },
    msg() {
      return this.locationtbl.selected.length > 0
        ? 'Are you sure you want to delete these locations? This is permanent..' : 'Please select location/s to delete'
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert(msg, variant) {
      this.dismissCountDown = this.dismissSecs
      this.alertMsg = msg
      this.alertvariant = variant
    },
    onSave() {
      this.$emit('save-step')
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
      // eslint-disable-next-line no-console
      console.log(val)
      return val
    },
    exportSelected() {
      if (this.locationtbl.selected.length > 0) {
        if (this.selectedLocationsComplete()) {
          this.$emit('export-locations')
        } else {
          this.showAlert('Unselect incomplete locations', 'danger')
        }
      }
    },
    onRowSelected(items) {
      this.$emit('select-location', items, 'locationtbl')
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows()
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected()
    },
    loadLocation(index) {
      const payload = this.locationtbl.items[index].value
      this.$emit('load-location', payload)
    },
    onDelete() {
      if (this.locationtbl.selected.length > 0) this.$emit('delete-location')
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
  .table-btns .col, .col-md-4, .col-md-6 {
    padding-left: .25rem;
    padding-right: .25rem;
  }
  .alert-row .alert-dismissible .close {
    padding: .2rem 1.25rem;
}
</style>
