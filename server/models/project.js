const { INTEGER, STRING, BOOLEAN } = require('sequelize')
module.exports = sequelize => sequelize.define('project', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  lpId: {
    type: INTEGER
  },
  vertical: {
    type: STRING
  },
  domain: {
      type: STRING
  },
  branding: {
      type: STRING
  }
})
