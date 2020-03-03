const axios = require('axios')
const diacriticsRemovalMap = require('../config/diacretics')
const typesMap = require('../config/typesmap')
const key = process.env.PLACES_KEY
/*
const returnObj = {
  neighborhood: {
    locations: []
  },
  landmark: {
    locations: []
  }
}
*/
const locationProperties = {
  vertical: '',
  domain: '',
  branding: '',
  address: '',
  city: '',
  state: '',
  zip: ''
}

async function run(locationProperties) {
  const latAndLong = await getLatLong(locationProperties)
}

async function getLatLong(prop) {
  const { address, city, state, zip } = prop
  const reqUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}${city}${state}${zip}&key=${key}`
  const addrresponse = await axios.get(reqUrl)
  const addrdata = JSON.parse(addrresponse)
  return { lat: addrdata.results[0].geometry.location.lat,
    lon: addrdata.results[0].geometry.location.lng }
}

function removeDiacritics(str) {
  diacriticsRemovalMap.forEach((regexFltr) => {
    str = str.replace(regexFltr.letters, regexFltr.base)
  })
  return str
}

module.exports = {
  run
}
