const models = require('../models')
module.exports = {
  createLocations,
  updateLocations,
  getLocations,
  getAllLocations,
  deleteLocation,
  updateInternalName
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
  for (let i = 0; i < locations.length; i++) {
    const { id, name, properties } = locations[i]
    await models.location.update({ name, properties }, { where: { id } })
  }
}

function getLocations (lpId) {
  return models.location.findAll({ where: { lpId } })
}

function getAllLocations () {
  return models.location.findAll({ attributes: ['properties', 'lpId', 'name'] })
    .then((res) => {
      return res.map((location) => {
        return {
          internal_branded_name: location.properties.internal_branded_name,
          name: location.name,
          lpId: location.lpId
        }
      })
    })
}

async function updateInternalName () {
  const locations = await models.location.findAll({ attributes: ['properties', 'name', 'id'] })
  for (let i = 0; i < locations.length; i++) {
    const { id, name, properties } = locations[i]
    properties.internal_branded_name = `${name} - ${properties.street_address_1} - ${properties.city}`
    await models.location.update({ properties }, { where: { id } })
  }
}

function deleteLocation (id) {
  return models.location.destroy({
    where: { id }
  })
}
