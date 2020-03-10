const models = require('../models')
module.exports = {
  createComment,
  getComment,
  updateComment,
  destroyComment
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
