const models = require('../models')
module.exports = {
  createFeedback,
  getFeedback
}

async function createFeedback (author, feedbackType, feedbackText, resolved) {
  const feedback = await models.feedback.create({
    author,
    feedbackType,
    feedbackText,
    resolved
  })
  return feedback
}

async function getFeedback () {
  const feedback = await models.feedback.findAll()
  return feedback
}
