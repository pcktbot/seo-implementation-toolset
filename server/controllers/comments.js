const models = require('../models')
module.exports = {
  createComment,
  getComment,
  updateComment,
  destroyComment,
  getAllComments,
  destroyAllComments
}

async function createComment (author, lpId, locationId, text) {
  const comment = await models.comment.create({
    author,
    lpId,
    locationId,
    text
  })
  return comment
}

function getComment (id) {
  return models.comment.findAll({ where: { id } })
}

async function getAllComments (locationId, lpId) {
  let where = { lpId }
  if (locationId) {
    where = { locationId }
  }
  const comments = await models.comment.findAll({ where })
  return comments
}

function updateComment (id, text) {
  return models.comment.update(
    { text },
    { where: { id } }
  )
}

function destroyComment (id) {
  return models.comment.destroy({
    where: { id }
  })
}

function destroyAllComments (locationId, lpId) {
  let where = { lpId }
  if (locationId) {
    where = { locationId }
  }
  return models.comment.destroy({ where })
}
