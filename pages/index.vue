<template>
  <div>
    <g5-nav />
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
              <initial-selections
                :visible="visible"
                :form="form"
                @upload-data="onUpload"
                @field-update="updateSelect"
                @input-update="updateInput"
              />
              <b-alert
                :show="form.dismissCountDown"
                :variant="form.alertvariant"
                @dismiss-count-down="countDownChanged"
                @dismissed="form.alertvariant='', form.alertMsg=''"
                dismissible
                fade
              >
                {{ form.alertMsg }}
              </b-alert>
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
    return {
      // data shared between index files in index mixins
      visible: true
    }
  },
  computed: {
    //
  },
  methods: {
    async postToDB(locations) {
      await this.$axios.$post('api/locations', {
        lpId: this.form.inputs.lpId,
        locations
      })
      await this.$axios.$post('api/lp-project', {
        lpId: this.form.inputs.lpId,
        selects: this.form.selects
      })
      window.open(`/lp-project/${this.form.inputs.lpId}`, '_self')
      this.form.loading = false
    },
    async onUpload() {
      try {
        const lpId = this.form.inputs.lpId
        const dbResult = await this.$axios.$get(`api/locations/${lpId}`)
        // finds LP project in DB
        if (!dbResult.length) {
          this.form.loading = true
          const data = await this.parseCSV(this.form.inputs.file)
          const locations = await this.getLocationData(data)
          // eslint-disable-next-line no-console
          console.log(locations)
          if (locations.length) {
            this.postToDB(locations)
          } else {
            this.showAlert(this.form.csvErrMsg, 'danger')
            this.form.loading = false
          }
        } else {
          this.showAlert(this.form.existingLPMsg, 'danger')
        }
      } catch (err) {
        this.showAlert(this.form.csvErrMsg, 'danger')
        this.form.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
