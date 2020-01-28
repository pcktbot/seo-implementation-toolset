const models = require('../models')
module.exports = {
  createLocations
}

async function createLocations (lpId, locations) {
  const returnLocations = []
  for (let i = 0; i < locations.length; i++) {
    const { name, properties } = locations[i]
    const location = await models.location.create({
      lpId,
      name,
      properties
    })
    returnLocations.push(location)
  }
  return returnLocations
}
