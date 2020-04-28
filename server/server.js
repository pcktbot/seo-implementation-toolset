require('dotenv').config()
const config = require('../nuxt.config.js')
const express = require('express')
const bodyParser = require('body-parser')
const consola = require('consola')
const g5Auth = require('@getg5/g5-auth')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const models = require('./models')
const {
  G5_AUTH_ENDPOINT: authorizationURL,
  G5_TOKEN_ENDPOINT: tokenURL,
  G5_AUTH_CLIENT_ID: clientID,
  G5_AUTH_CLIENT_SECRET: clientSecret,
  G5_AUTH_REDIRECT_URI: callbackURL,
  G5_AUTH_ME_ENDPOINT: authMeEndpoint,
  SESSION_SECRET: secret
} = process.env
const authConfig = {
  passport: {
    authorizationURL,
    tokenURL,
    clientID,
    clientSecret,
    callbackURL
  },
  authMeEndpoint,
  session: {
    secret
  },
  sucessRedirectPath: '/'
}
g5Auth.init(app, authConfig)
app.use(bodyParser.json({ limit: '10000kb' }))
app.use(g5Auth.isAuthenticated)
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
