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
  domainStrategy: {
      type: STRING
  },
  chainBranding: {
      type: BOOLEAN
  }
})
