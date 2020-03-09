const axios = require('axios')
const xmlparser = require('xml-js')
const { USPS_API_KEY } = process.env
const { USPS_USER_ID } = process.env
module.exports = (app) => {
  // USPS API Routes
  app.post('/routes/uspsapi/verify-address', async (req, res) => {
    // console.log(req.body)
    const { street_address_1, city, state, postal_code, country } = req.body.form
    const address = `
    <AddressValidateRequest USERID="${USPS_USER_ID}">
        <Revision>1</Revision>
            <Address ID="0">
                <Address1></Address1>
                <Address2>${street_address_1}</Address2>
                <City>${city}</City>
                <State>${state}</State>
                <Zip5>${postal_code}</Zip5>
                <Zip4/>
            </Address>
    </AddressValidateRequest>    
    `
    // console.log(address)
    const uspsReq = `https://secure.shippingapis.com/ShippingAPI.dll?API=${USPS_API_KEY}&XML=${address}`
    console.log(uspsReq)
    // const response = await axios.get(`https://secure.shippingapis.com/ShippingAPI.dll?API=${USPS_API_KEY}&XML=${address}`)
    const response = await axios.get(`https://secure.shippingapis.com/ShippingAPI.dll?API=AddressValidateRequest/${USPS_API_KEY}&XML=${address}`)
    console.log(response.data)
    res.json(xmlparser.xml2json(response.data))
  })
}
