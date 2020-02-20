const models =require ('../models')
module.exports = {
    createProject
}

async function createProject (lpId, selects) {
    const returnProject = []
    const project = await models.project.create({
        lpId,
        selects
    })
    returnProject.push(project)
    return returnProject
}

