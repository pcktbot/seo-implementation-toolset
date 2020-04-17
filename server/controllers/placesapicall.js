const axios = require('axios')

module.exports = {
  getLatLong
}
const key = process.env.PLACES_API_KEY

async function getLatLong(prop) {
  const { address, city, state, zip } = prop
  const formattedAdd = /#/g.test(address) ? address.split(/#/g)[0] : address
  const reqUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAdd}${city}${state}${zip}&key=${key}`
  const addrresponse = await axios.get(reqUrl)
  const addrdata = addrresponse.data
  return { lat: addrdata.results[0].geometry.location.lat,
    long: addrdata.results[0].geometry.location.lng }
}
