// Author,feedbackType (string), feedbackText (string), resolved (BOOLEAN)
const { INTEGER, STRING, BOOLEAN } = require('sequelize')
module.exports = sequelize => sequelize.define('feedback', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  author: {
    type: STRING
  },
  feedbackType: {
    type: STRING
  },
  feedbackText: {
    type: STRING
  },
  resolved: {
    type: BOOLEAN
  }
})
