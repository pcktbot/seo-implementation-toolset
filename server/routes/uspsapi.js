/* eslint-disable camelcase */
const axios = require('axios')
const xmlparser = require('xml-js')
const { USPS_USER_ID } = process.env
module.exports = (app) => {
  // USPS API Routes
  app.post('/routes/uspsapi/verify-address', async (req, res) => {
    try {
      const {
        street_address_1,
        city,
        state,
        postal_code
      } = req.body.form

      const address = `
        <AddressValidateRequest USERID="${USPS_USER_ID}">
          <Revision>1</Revision>
          <Address ID="1">
            <Address1/>
            <Address2>${street_address_1}</Address2>
            <City>${city}</City>
            <State>${state}</State>
            <Zip5>${postal_code}</Zip5>
            <Zip4/>
          </Address>
        </AddressValidateRequest>
      `

      const response = await axios.get(`http://production.shippingapis.com/ShippingAPI.dll?API=Verify&XML=${address}`)
      res.send(xmlparser.xml2json(response.data))
    } catch (e) {
      res.status(500).send(e.message)
    }
  })
}
