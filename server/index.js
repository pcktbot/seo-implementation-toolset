require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const g5Auth = require('@getg5/g5-auth')
const config = require('../nuxt.config.js')
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
const regexWhitelist = [
  /\/copy\/\d*$/,
  /\/api\/lp-project\/\d*$/,
  /\/api\/locations\/\d*$/,
  /\/api\/locations/,
  /\/_nuxt\/\S*\.js$/,
  /\/g5-logo-2\.png/,
  /\/green-check\.svg/,
  /\/red-x\.svg/
]
g5Auth.init(app, authConfig)

app.use(bodyParser.json({ limit: '10000kb' }))
app.use(checkWhiteList)
function checkWhiteList(req, res, next) {
  if (dynamicWhitelist(req.path)) {
    next()
  } else {
    g5Auth.isAuthenticated(req, res, next)
  }
}

function dynamicWhitelist(path) {
  return regexWhitelist.some(url => url.test(path))
}
require('./routes/api')(app)
require('./routes/placesapi')(app)
require('./routes/uspsapi')(app)
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
      app.listen(port, host)
      consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
      })
    })
}

start()
