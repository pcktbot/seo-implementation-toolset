const axios = require('axios')
class CIDS {
  constructor (params) {
    this.name = params.name
    this.address = params.address
    this.vertical = params.vertical
    this.lat = params.lat
    this.long = params.long
    this.apiKey = process.env.PLACES_API_KEY
  }
  /**
   * Gets Array of Google Place objects near lat,lon passed into function
   * @returns {[Array]} - Array of place objects near the lat lon passed in
   */
  async getPlaces() {
    const placesReq = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.long}&rankby=distance&key=${this.apiKey}`
    const { data } = await this.fetchTerms(placesReq)
    return data
  }

  // returns array of places matching name or address number
  filterPlaces(places) {
    return places.results.filter((place) => {
      const addNum1 = this.address.split(/W+/)[0]
      const addNum2 = place.vicinity.split(/W+/)[0]
      const name1 = place.name.toLowerCase()
      const name2 = this.name.toLowerCase()
      return name1.includes(name2) || name2.includes(name1) || addNum1 === addNum2
    })
  }

  fetchTerms(url) {
    return axios.get(url)
  }

  /**
   * Gets Google CID URL
   * @param {Number} placeid
   * @param {String} apikey
   * @returns {String} - cid url
   */
  async placeIDSearch(placeId) {
    const apiurl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${this.apiKey}`
    const { data } = await this.fetchTerms(apiurl)
    return {
      cid: data.result.url.split('cid=')[1],
      url: data.result.url
    }
  }

  async addCids(places) {
    for (let i = 0; i < places.length; i++) {
      const place = places[i]
      const { cid, url } = await this.placeIDSearch(place.place_id)
      place.cid = cid
      place.url = url
    }
  }

  async run() {
    const places = await this.getPlaces()
    const filteredPlaces = this.filterPlaces(places)
    await this.addCids(filteredPlaces)
    return filteredPlaces
  }
}

module.exports = CIDS
