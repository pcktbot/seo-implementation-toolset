const models = require('../models')
module.exports = {
  createProject,
  getProject,
  updateProject
}

async function createProject (lpId, selects) {
  const project = { lpId }
  for (let i = 0; i < selects.length; i++) {
    const key = selects[i].id
    const value = selects[i].value
    project[key] = value
  }
  const newProject = await models.project.create(project)
  return newProject
}

function getProject (lpId) {
  return models.project.findAll({ where: { lpId } })
}

async function updateProject (lpId, selects) {
  const update = selects.reduce((obj, select) => {
    obj[select.id] = select.value
    return obj
  }, {})
  await models.project.update(update, { where: { lpId } })
}
