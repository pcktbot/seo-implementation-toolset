// Author,feedbackType (string), feedbackText (string), resolved (BOOLEAN)
const { INTEGER, STRING } = require('sequelize')
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
  status: {
    type: STRING
  },
  resolutionNotes: {
    type: STRING
  }
})
