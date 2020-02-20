const newLocations = require('../controllers/locations')
const newProject = require('../controllers/projects')
module.exports = (app) => {
  //location routes
  app.post('/api/locations', async (req, res) => {
    const { lpId, locations } = req.body
    const data = await newLocations.createLocations(lpId, locations)
    res.json(data)
  })

  app.put('/api/locations', async (req, res) => {
    const { locations } = req.body
    await newLocations.updateLocations(locations)
    res.sendStatus(200)
  })

  app.get('/api/locations/:lpId', async (req, res) => {
    const { lpId } = req.params
    const locations = await newLocations.getLocations(lpId)
    res.json(locations)
  })

  //project routes
  app.post('/api/lp-project', async (req, res) => {
    const { lpId, selects } = req.body
    console.log(selects)
    // loop through (for) create empty object then add key-value pairs
    const projectData = await newProject.createProject( lpId, selects)
    res.json(projectData)
  })
}
