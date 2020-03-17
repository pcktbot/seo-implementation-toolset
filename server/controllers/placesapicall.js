const axios = require('axios')

module.exports = {
  getLatLong
}
const key = process.env.PLACES_API_KEY

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
