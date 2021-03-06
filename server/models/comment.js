const { INTEGER, STRING } = require('sequelize')
module.exports = sequelize => sequelize.define('comment', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  author: {
    type: STRING
  },
  lpId: {
    type: STRING
  },
  locationId: {
    type: INTEGER
  },
  text: {
    type: STRING
  }
})
