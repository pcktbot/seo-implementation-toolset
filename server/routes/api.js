const newLocations = require('../controllers/locations')
const newProject = require('../controllers/projects')
module.exports = (app) => {
  // location routes
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

  // project routes
  app.post('/api/lp-project', async (req, res) => {
    const { lpId, selects } = req.body
    // loop through (for) create empty object then add key-value pairs
    const projectData = await newProject.createProject(lpId, selects)
    res.json(projectData)
  })

  // Project Destroy Route
  app.delete('/api/lp-project/:lpID/:locationId', async (req, res) => {
    const { locationId } = req.params
    await newLocations.deleteLocation(locationId)
    res.sendStatus(200)
  })

  // write get route to pull project level info
  app.get('/api/lp-project/:lpId', async (req, res) => {
    const { lpId } = req.params
    const projectInfo = await newProject.getProject(lpId)
    res.json(projectInfo)
  })
}
