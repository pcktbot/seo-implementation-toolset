<template>
  <b-modal
    id="cid-modal"
    :hide-footer="hidden"
    header-bg-variant="primary"
    size="lg"
    title="Choose GMB CID"
  >
    <b-container fluid>
      <b-row class="mb-1 text-left">
        <b-col>
          <b-card class="h-100">
            <h5>Pick Business</h5>
            <hr>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import Locations from '~/mixins/locations'
export default {
  mixins: [Locations],
  props: {
    res: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data () {
    return {
      hidden: true
    }
  },
  computed: {
    ...mapGetters({
      form: 'selectedLocation/stepOneData'
    })
  },
  methods: {
    toTitleCase(str) {
      return str.replace(
        /\w\S*/g,
        (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        }
      )
    },
    hide() {
      this.$bvModal.hide('cid-modal')
    }
    // updateData() {
    //   const data = {}
    //   this.res.data.elements[0].elements[0].elements.forEach((prop) => {
    //     if (Object.keys(this.uspsprops).includes(prop.name)) {
    //       const value = prop.name !== 'State' ? this.toTitleCase(prop.elements[0].text) : prop.elements[0].text
    //       data[this.uspsprops[prop.name]] = value
    //     }
    //   })
    //   this.updateAddress(data)
    //   this.hide()
    // }
  }
}
</script>

<style>
  footer {
    margin-top: 0em;
  }
</style>
