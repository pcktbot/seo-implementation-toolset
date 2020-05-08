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
          <b-card class="h-100">
            <h5>Client Address</h5>
            <hr>
            <b-row
              v-for="(prop, i) in allowed"
              :key="`${i}-client`"
              class="ml-0 mr-0"
            >
              <p>{{ toTitleCase(`${headers[prop]}: ${form[prop]}`) }}</p>
            </b-row>
            <b-button
              @click="hide"
              variant="secondary"
              block
              class="text-center"
            >
              Use Client Provided
            </b-button>
          </b-card>
        </b-col>
        <b-col cols="6">
          <b-card class="h-100">
            <h5>USPS Address</h5>
            <hr>
            <div v-if="res === null || getUSPSProps[0].name === 'Error' || res.data.elements[0].name === 'Error'">
              <b-row
                v-for="(prop,index) in Object.keys(headers)"
                :key="index"
                class="ml-0 mr-0"
              >
                <p>
                  {{ `${toTitleCase(headers[prop])}: N/A` }}
                </p>
              </b-row>
            </div>
            <div v-else>
              <b-row
                v-for="(property, index) in getUSPSProps"
                :key="index"
                class="ml-0 mr-0"
              >
                <p v-if="Object.keys(uspsprops).includes(property.name)">
                  {{ toTitleCase(`${headers[uspsprops[property.name]]}: ${property.elements[0].text}`) }}
                </p>
              </b-row>
            </div>

            <b-button
              @click="updateData"
              :disabled="res === null || getUSPSProps[0].name === 'Error'"
              variant="secondary"
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
import Locations from '~/mixins/locations'
export default {
  mixins: [Locations],
  props: {
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
      headers: {
        street_address_1: 'Address',
        city: 'City',
        state: 'State',
        postal_code: 'Zip Code'
      },
      hidden: true
    }
  },
  computed: {
    form: {
      get() { return this.$getters['selectLocation/formFields'] },
      set(val) {}
    },
    getUSPSProps() {
      return this.res !== null
        ? this.res.data.elements[0].elements[0].elements
        : []
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
      this.updateAddress(data)
      // this.$emit('update-address', data)
      this.hide()
    }
  }
}
</script>

<style>
  footer {
    margin-top: 0em;
  }
</style>
