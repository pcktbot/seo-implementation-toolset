const models = require('../models')
module.exports = {
  createLocations,
  updateLocations,
  getLocations
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

async function updateLocations (locations) {
  for(let i = 0; i < locations.length; i++) {
    const {id, name, properties} = locations[i]
    await models.location.update({name, properties}, {where: {id}})
  }
  return
}

function getLocations (lpId) {
  return models.location.findAll({where: {lpId}})
}
