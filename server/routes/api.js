const newLocations = require('../controllers/locations')
module.exports = (app) => {
  app.post('/api/locations', async (req, res) => {
    const { lpId, locations } = req.body
    const data = await newLocations.createLocations(lpId, locations)
    res.json(data)
  })
}
