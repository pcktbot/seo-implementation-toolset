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
        class="self-align-center table mt-4"
      >
        <template v-slot:cell(select)="{ rowSelected }">
          <template v-if="rowSelected">
            <b-icon class="h4 mb-0" icon="check" variant="success" />
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
            @click="loadLocation(data.index)"
            href="#loctable"
            variant="success"
            class="px-4"
            size="sm"
            pill
          >
            Edit
          </b-btn>
        </template>
        <template v-slot:cell(status)="data">
          <template v-if="data.value === true">
            <b-icon class="h4 mb-0" icon="check-circle" variant="success" />
          </template>
          <template v-else>
            <b-icon class="h4 mb-0" icon="x-circle" variant="warning" />
          </template>
        </template>
      </b-table>
      <p>
        <b-button @click="selectAllRows" size="sm">
          Select all
        </b-button>
        <b-button @click="clearSelected" size="sm">
          Clear selected
        </b-button>
        <b-button v-b-modal.modal-1 variant="danger" size="sm">
          Delete Selected
        </b-button>
      </p>
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
  computed: {
    msg() {
      // eslint-disable-next-line no-console
      console.log(this.locationtbl.selected.length)
      return this.locationtbl.selected.length > 0
        ? 'Are you sure you want to delete these locations? This is permanent..' : 'Please select location/s to delete'
    }
  },
  methods: {
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
      if (this.locationtbl.selected.length > 0) this.$emit('delete-location', 'locationtbl')
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
</style>
