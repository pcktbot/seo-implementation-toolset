const models = require('../models')
module.exports = {
  createFeedback
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
