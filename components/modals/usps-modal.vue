<template>
  <b-modal
    id="usps-modal"
    :hide-footer="hidden"
    header-bg-variant="primary"
    size="lg"
    title="Choose Address Version"
  >
    <b-container fluid>
      <b-row class="mb-1 text-left">
        <b-col cols="6">
          <b-card>
            <h5>Client Address</h5>
            <hr>
            <b-row
              v-for="(prop, i) in allowed"
              :key="`${i}-client`"
              class="ml-0 mr-0"
            >
              <p>{{ toTitleCase(`${prop.replace(/_/g,' ')}: ${form[prop]}`) }}</p>
            </b-row>
            <b-button
              @click="hide"
              variant="primary"
              block
              class="text-center"
            >
              Use Client Provided
            </b-button>
          </b-card>
        </b-col>
        <b-col cols="6">
          <b-card>
            <h5>USPS Address</h5>
            <hr>
            <b-row
              v-for="(property, index) in getUSPSProps"
              :key="index"
              class="ml-0 mr-0"
            >
              <p v-if="Object.keys(uspsprops).includes(property.name)">
                {{ toTitleCase(`${allowed[index].replace(/_/g,' ')}: ${property.elements[0].text}`) }}
              </p>
            </b-row>
            <b-button
              @click="updateData"
              variant="primary"
              block
              class="text-center"
            >
              Use USPS Provided
            </b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
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
    res: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      allowed: ['street_address_1', 'city', 'state', 'postal_code'],
      uspsprops: {
        Address2: 'street_address_1',
        City: 'city',
        State: 'state',
        Zip5: 'postal_code'
      },
      hidden: true
    }
  },
  computed: {
    getUSPSProps() {
      return this.res !== null ? this.res.data.elements[0].elements[0].elements : []
    }
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
      this.$bvModal.hide('usps-modal')
    },
    updateData() {
      const data = {}
      this.res.data.elements[0].elements[0].elements.forEach((prop) => {
        if (Object.keys(this.uspsprops).includes(prop.name)) {
          const value = prop.name !== 'State' ? this.toTitleCase(prop.elements[0].text) : prop.elements[0].text
          data[this.uspsprops[prop.name]] = value
        }
      })
      this.$emit('update-address', data)
      this.hide()
    }
  }
}
</script>

<style>
  footer {
    margin-top: 0em;
  }
  .modal-header {
    padding-left: 2em;
  }
</style>
