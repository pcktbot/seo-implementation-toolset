const { INTEGER, STRING } = require('sequelize')
module.exports = sequelize => sequelize.define('project', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  lpId: {
    type: STRING
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
