const axios = require('axios')
// const diacriticMap = require('../config/diacritics')
const maps = require('./maps')
class LocationTerms {
  constructor (params) {
    this.class = params.class
    this.vertical = params.vertical
    this.typemap = null
    this.neighborhoodMap = maps.neighborhoodMap
    this.terms = {}
    this.locations = {
      type1: {},
      type2: {}
    }
    this.lat = params.lat
    this.long = params.long
    this.apiKey = process.env.PLACES_API_KEY
    this.city = params.city
  }

  async getLocationNames() {
    await this.getNeighborhoodNames()
    await this.getLandmarkNames()
  }

  async getNeighborhoodNames() {
    for (let i = 0; i < Object.keys(this.neighborhoodMap).length; i++) {
      const key = Object.keys(this.neighborhoodMap)[i]
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.long}&types=${key}&rankby=distance&key=${this.apiKey}`
      const { data } = await this.fetchTerms(url)
      const resultKeys = Object.keys(data.results)
      let count = resultKeys.length
      if (count > this.neighborhoodMap[key]) {
        count = this.neighborhoodMap[key]
      }
      for (let x = 0; x < count; x++) {
        if (!this.locations.type1[key]) {
          this.locations.type1[key] = []
        }
        this.locations.type1[key].push(data.results[x].name)
      }
    }
  }

  async getLandmarkNames() {
    for (let i = 0; i < Object.keys(this.terms).length; i++) {
      const key = Object.keys(this.terms)[i]
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.long}&types=${key}&radius=8000&key=${this.apiKey}`
      const { data } = await this.fetchTerms(url)
      const resultKeys = Object.keys(data.results)
      let count = resultKeys.length
      if (count > this.terms[key]) {
        count = this.terms[key]
      }
      for (let x = 0; x < count; x++) {
        if (!this.locations.type2[key]) {
          this.locations.type2[key] = []
        }
        const name = data.results[x].name
        const duplicate = this.locations.type2[key].includes(name)
        // const name = this.formatName(data.results[x].name)
        if (!duplicate) {
          this.locations.type2[key].push(name)
        }
      }
    }
  }

  fetchTerms(url) {
    // axios request here
    return axios.get(url)
  }

  // formatName(name) {
  //   this.removeDiacritics(name).replace(/[^a-zA-Z0-9\s+\-']|Helipad 1|Helipad 2|Helipad|Heliport/g, '').replace(/\-/g, ' ').replace(/\s+/g, ' ')
  // }

  // removeDiacritics(name) {
  //   for (let i = 0; i < diacriticMap.length; i++) {
  //     name = name.replace(diacriticMap[i].letters, diacriticMap[i].base)
  //   }
  //   return name
  // }

  getMapName() {
    const classNoSpace = this.class && this.vertical === 'mf'
      ? this.class.replace(' ', '') : ''
    const key = `${this.vertical}${classNoSpace}Map`
    this.terms = maps[key]
  }

  async run() {
    this.getMapName()
    await this.getLocationNames()
  }

  get results() {
    return this.locations
  }

  set results(locations) {
    this.locations = locations
  }
}

module.exports = LocationTerms
