require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const config = require('../nuxt.config.js')
const models = require('./models')
app.use(bodyParser.json({ limit: '10000kb' }))
require('./routes/api')(app)
// Import and Set Nuxt.js options

config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  const nuxt = new Nuxt(config)
  const { host, port } = nuxt.options.server

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(nuxt.render)
  models.sequelize
    .sync()
    .then(() => {
      //signale.database(`Connected: ${dbName}`)
      // Listen the server
      app.listen(port, host)
      consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
      })
    })
}

start()
