<template>
  <div>
    <g5-nav />
    <b-container fluid class="px-5">
      <b-row>
        <b-col>
          <b-card no-body class="my-5">
            <b-card-header>
              <h3 class="mb-1">
                Complete Options Below
              </h3>
            </b-card-header>
            <b-card-body class="py-5">
              <initial-selections
                :form="form"
                @upload-data="onUpload"
                @err-upld="setMsgConfig"
                @field-update="updateSelect"
                @input-update="updateInput"
              />
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Papa from 'papaparse'
import g5Nav from '~/components/nav'
import initialSelections from '~/components/initial-selections'
export default {
  components: {
    g5Nav,
    initialSelections
  },
  data () {
    return {
      form: {
        inputs: {
          lpId: null,
          file: null
        },
        showMsg: false,
        loading: false,
        msg: '',
        alertvariant: '',
        csvSuccessMsg: 'Your CSV has been successfully imported, please select a location below',
        csvErrMsg: 'There was an error uploading the csv',
        existingLPMsg: 'There is already a LP project under this ID. To add additional locations, load the LP project',
        selects: [
          {
            id: 'vertical',
            value: null,
            options: [
              { value: null, text: 'Select Vertical' },
              { value: 'mf', text: 'Multi-Family' },
              { value: 'ss', text: 'Self Storage' },
              { value: 'sl', text: 'Senior Living' }
            ]
          },
          {
            id: 'domain',
            value: null,
            options: [
              { value: null, text: 'Select Domain Strategy' },
              { value: 'multi', text: 'Multi Domain' },
              { value: 'single', text: 'Single Domain' }
            ]
          },
          {
            id: 'branding',
            value: null,
            options: [
              { value: null, text: 'Select Chain Branding' },
              { value: 'yes', text: 'Yes' },
              { value: 'no', text: 'No' }
            ]
          }
        ]
      },
      tableheaders: {
        fields: [
          {
            key: 'strategy',
            label: 'Strategy'
          },
          {
            key: 'current_url',
            label: 'Current URL',
            sortable: true
          },
          {
            key: 'formatted_url',
            label: 'Formatted URL',
            sortable: true
          },
          {
            key: 'wildcard',
            label: 'Wildcard'
          },
          'remove'
        ],
        items: []
      }
    }
  },
  computed: {
    getAddPropFields() {
      return {
        population: null,
        uspsvalid: null,
        recommended_name: null,
        redirects: this.tableheaders,
        redirecttext: '',
        redirectstrat: '',
        stepOneComplete: false,
        stepTwoComplete: false,
        stepThreeComplete: false,
        stepFourComplete: false,
        locationComplete: false
      }
    }
  },
  methods: {
    updateSelect({ key, val }) {
      const i = this.form.selects.findIndex(select => select.id === key)
      this.form.selects[i].value = val
    },
    updateInput({ key, val }) {
      (key === 'file')
        ? this.form.inputs[key] = [val]
        : this.form.inputs[key] = val
    },
    reject(obj, keys) {
      const vkeys = Object.keys(obj)
        .filter(k => !keys.includes(k))
      return this.pick(obj, vkeys)
    },
    pick(obj, keys) {
      return keys.map(k => k in obj ? { [k]: obj[k] } : {})
        .reduce((res, o) => Object.assign(res, o), {})
    },
    setMsgConfig(msg, variant, msgOn) {
      this.form.msg = msg
      this.form.alertvariant = variant
      this.form.showMsg = msgOn
    },
    postToDB(locations) {
      this.$axios.$post('api/locations', {
        lpId: this.form.inputs.lpId,
        locations
      }).then((res) => {
        this.$axios
          .$post('api/lp-project', {
            lpId: this.form.inputs.lpId,
            selects: this.form.selects
          }).then((res) => {
            window.open(`/lp-project/${this.form.inputs.lpId}`)
            this.form.loading = false
          })
      })
    },
    onUpload() {
      try {
        const lpId = this.form.inputs.lpId
        this.$axios.$get(`api/locations/${lpId}`).then((res) => {
          // finds LP project in DB
          if (!res.length) {
            this.form.loading = true
            Papa.parse(this.form.inputs.file, {
              header: true,
              complete: (res) => {
                const locations = res.data[0].name ? res.data.map((location) => {
                  const { name } = location
                  const properties = this.reject(location, ['name'])
                  for (const prop in this.getAddPropFields) {
                    properties[prop] = this.getAddPropFields[prop]
                  }
                  return { name, properties }
                }).filter(location => location.name) : []
                if (locations.length) {
                  this.postToDB(locations)
                } else {
                  this.setMsgConfig(this.form.csvErrMsg, 'danger', true)
                  this.form.loading = false
                }
              }
            })
          } else {
            this.setMsgConfig(this.form.existingLPMsg, 'danger', true)
          }
        })
      } catch (err) {
        this.setMsgConfig(this.form.csvErrMsg, 'danger', true)
        this.form.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
