const newLocations = require('../controllers/locations')
module.exports = (app) => {
  app.post('/api/locations', async (req, res) => {
    const { lpId, locations } = req.body
    const data = await newLocations.createLocations(lpId, locations)
    res.json(data)
  })

  app.put('/api/locations', async (req, res) => {
    //Capture fields from form
    const {locations} = req.body
    console.log(locations)
    await newLocations.updateLocations(locations)
    res.sendStatus(200)
  })

  app.get('/api/locations/:lpId', async (req, res) => {
    const {lpId} = req.params
    //await getLocations
    const locations = await newLocations.getLocations(lpId) 
    res.json(locations)
  })
}
