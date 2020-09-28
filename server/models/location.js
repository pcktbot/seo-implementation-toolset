const { INTEGER, JSONB, STRING } = require('sequelize')
module.exports = sequelize => sequelize.define('location', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: STRING
  },
  lpId: {
    type: STRING
  },
  properties: {
    type: JSONB
  }
})
