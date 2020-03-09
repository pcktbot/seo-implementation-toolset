const axios = require('axios')
// const diacriticsRemovalMap = require('../config/diacritics')
// const typesMap = require('../config/typesmap')
module.exports = {
  getLatLong
}
const key = process.env.PLACES_API_KEY
/*
const returnObj = {
  neighborhood: {
    locations: []  --- array of strings that would be the "type 1" terms
  },
  landmark: {
    locations: []  -- array of stringsthat would be the type 2 terms from
  }
}
*/
// const locationProperties = {
//   vertical: '',
//   domain: '',
//   branding: '',
//   type: '',
//   address: '',
//   city: '',
//   state: '',
//   zip: ''
// }

async function getLatLong(prop) {
  const { address, city, state, zip } = prop
  const reqUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}${city}${state}${zip}&key=${key}`
  const addrresponse = await axios.get(reqUrl)
  const addrdata = addrresponse.data
  // eslint-disable-next-line no-console
  console.log(addrdata)
  return { lat: addrdata.results[0].geometry.location.lat,
    long: addrdata.results[0].geometry.location.lng }
}
