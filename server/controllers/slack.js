const axios = require('axios')

module.exports = {
  onFeedback
}
const url = process.env.SLACK_FEEDBACK_URL

function onFeedback(feedback) {
  return axios.post(url, {
    text: feedback.text,
    username: 'SEO Toolset Feedback',
    icon_emoji: ':sally:'
  })
}
