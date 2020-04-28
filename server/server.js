require('dotenv').config()
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')
const express = require('express')
const bodyParser = require('body-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const config = require('../nuxt.config.js')
const models = require('./models')
app.use(bodyParser.json({ limit: '10000kb' }))
require('./routes/api')(app)
require('./routes/placesapi')(app)
require('./routes/uspsapi')(app)

config.dev = !(process.env.NODE_ENV === 'production')

require('greenlock-express')
  .init(function() {
    return {
      greenlock: require('./greenlock.js'),
      cluster: false
    }
  })
  .ready(async (glx) => {
    const nuxt = new Nuxt(config)

    if (config.dev) {
      const builder = new Builder(nuxt)
      await builder.build()
    } else {
      await nuxt.ready()
    }
    app.use(nuxt.render)
    models.sequelize.sync().then(() => glx.serveApp(app))
  })
