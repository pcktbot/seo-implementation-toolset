import Papa from 'papaparse'
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      splitRgx: /\s*(?:,|$)\s*/, // staying here
      // staying here
      propertiesToArr: [
        'neighborhood_keywords',
        'landmark_keywords',
        'amenity_keywords',
        'neighborhood',
        'neighborhood_2',
        'landmark_1_name',
        'apartment_amenity_1',
        'community_amenity_1'
      ]
    }
  },
  computed: {
    ...mapState({
      addImportProps: state => state.addImportProps
    })
  },
  methods: {
    ...mapMutations({
      set: 'initSelects/SET'
    }),
    async postToDB(locations) {
      await this.$axios.$post('api/locations', {
        lpId: this.initSelects.lpId,
        locations
      })
      await this.$axios.$post('api/lp-project', {
        lpId: this.initSelects.lpId,
        selects: this.initSelects.selects
      })
    },
    async loadLocations(locations) {
      const res = await this.$axios.$post('api/locations', {
        lpId: this.initSelects.lpId,
        locations
      })
      this.locations.push(...res) // adds locations to data
      this.locationtbl.items.push(...[ // adds locations to loc table
        ...res.map((location) => {
          const { name, properties } = location
          return {
            select: false,
            location: `${name} - ${properties.street_address_1}`,
            status: properties.locationComplete,
            prstatus: properties.prComplete,
            value: location.id
          }
        })
      ])
      this.set({ 'loading': false })
      this.showAlert(this.alertProps.csvSuccessMsg, 'success')
    },
    async processUpload() {
      this.set({ 'loading': true })
      const data = await this.parseCSV(this.initSelects.file)
      const locations = await this.getLocationData(data)
      if (locations.length && !this.onProjectPage) { // on home page
        // eslint-disable-next-line no-console
        console.log(locations)
        await this.postToDB(locations)
        // window.open(`/lp-project/${this.initSelects.lpId}`, '_self')
        this.set({ 'loading': false })
      } else if (locations.length && this.onProjectPage) { // on project page
        this.loadLocations(locations)
      } else {
        this.showAlert(this.alertProps.csvErrMsg, 'danger') // err
        this.set({ 'loading': false })
      }
    },
    async upload() {
      try {
        if (!this.onProjectPage) { // on home page
          const lpId = this.initSelects.lpId
          const dbResult = await this.$axios.$get(`api/locations/${lpId}`)
          !dbResult.length // no existing project found in db
            ? this.processUpload()
            : this.showAlert(this.alertProps.existingLPMsg, 'danger')
        } else { // on Project Page
          this.processUpload()
        }
      } catch (err) {
        this.showAlert(this.alertProps.csvErrMsg, 'danger')
        this.set({ 'loading': false })
      }
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
    parseCSV(file) {
      return new Promise((resolve) => {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            resolve(results.data)
          }
        })
      })
    },
    getLocationData(data) {
      return data[0].name ? data.map((location) => {
        const { name } = location
        const properties = this.reject(location, ['name'])
        const addPropertyFields = this.addImportProps
        for (const prop in addPropertyFields) {
          properties[prop] = addPropertyFields[prop]
        } // turns keyword string into arr objects
        this.propertiesToArr.forEach((prop) => {
          const arr = properties[prop] ? properties[prop].split(this.splitRgx) : []
          for (let i = 0; i < arr.length; i++) {
            arr[i] = { name: arr[i], id: i }
          }
          properties[prop] = arr
        })
        return { name, properties }
      }).filter(location => location.name) : []
    }
  }
}
