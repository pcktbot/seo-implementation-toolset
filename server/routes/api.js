const newLocations = require('../controllers/locations')
const newProject = require('../controllers/projects')
const newComment = require('../controllers/comments')
const newFeedback = require('../controllers/feedback')
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
  // update location internal_brand_name
  app.get('/api/update', async (req, res) => {
    await newLocations.updateInternalName()
    res.sendStatus(200)
  })

  // Get locations associated to an LP Project
  app.get('/api/locations/:lpId', async (req, res) => {
    const { lpId } = req.params
    const locations = await newLocations.getLocations(lpId)
    res.json(locations)
  })

  // Get all locations in db
  app.get('/api/locations', async (req, res) => {
    const locations = await newLocations.getAllLocations()
    res.json(locations)
  })

  // Create New Projects on Upload
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

  // Project Info Update Route
  app.put('/api/lp-project/:lpId', async (req, res) => {
    const { lpId } = req.params
    const { selects } = req.body
    await newProject.updateProject(lpId, selects)
    res.sendStatus(200)
  })

  // write get route to pull project level info
  app.get('/api/lp-project/:lpId', async (req, res) => {
    const { lpId } = req.params
    const projectInfo = await newProject.getProject(lpId)
    res.json(projectInfo)
  })
  // Comment Routes

  // Get route for all comments related to a project OR location
  app.get('/api/comments', async (req, res) => {
    const { locationId, lpId } = req.query
    const comments = await newComment.getAllComments(locationId, lpId)
    res.json(comments)
  })

  // Post route to create comment
  app.post('/api/comments', async (req, res) => {
    const { author, lpId, locationId, text } = req.body
    const comment = await newComment.createComment(author, lpId, locationId, text)
    res.json(comment)
  })

  // Get Route to Edit Comment
  app.get('/api/comments/:id/edit', async (req, res) => {
    const { id } = req.params
    const comment = await newComment.getComment(id)
    res.json(comment)
  })

  // Update edited comment
  app.put('/api/comments/:id', async (req, res) => {
    const { id } = req.params
    const { text } = req.body
    const comment = await newComment.updateComment(id, text)
    res.json(comment)
  })

  // Delete Route to destroy/remove comments
  app.delete('/api/comments/:id', async (req, res) => {
    const { id } = req.params
    await newComment.destroyComment(id)
    res.sendStatus(200)
  })

  // Delete All Route
  // ?locationId={locationId} or ?lpId={lpId}
  app.delete('/api/comments', async (req, res) => {
    const { locationId, lpId } = req.query
    await newComment.destroyAllComments(locationId, lpId)
    res.sendStatus(200)
  })

  // FEEDBACK TABLE ROUTES

  // Create form to the db
  app.post('/api/feedback', async (req, res) => {
    const { author, feedbackType, feedbackText, status } = req.body
    const feedback = await newFeedback.createFeedback(author, feedbackType, feedbackText, status)
    res.json(feedback)
  })

  // Retrieve feedback record
  app.get('/api/feedback', async (req, res) => {
    const feedback = await newFeedback.getFeedback()
    res.json(feedback)
  })
  // Update feedback record
  app.put('/api/feedback/:id', async (req, res) => {
    const { id } = req.params
    const { status, resolutionNotes } = req.body
    const feedback = await newFeedback.updateFeedback(id, status, resolutionNotes)
    res.json(feedback)
  })

  app.delete('/api/feedback/:id', async (req, res) => {
    const { id } = req.params
    await newFeedback.deleteFeedback(id)
    res.sendStatus(200)
  })

  // Get G5 Auth user info
  // eslint-disable-next-line require-await
  app.get('/api/auth/me', async (req, res) => {
    const { user } = req
    const currentUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
    res.json(currentUser)
  })
}
