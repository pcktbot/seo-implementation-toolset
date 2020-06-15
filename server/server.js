require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const consola = require('consola')
const g5Auth = require('@getg5/g5-auth')
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')
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

const regexWhitelist = [
  /\/copy\/\d*$/,
  /\/api\/lp-project\/\d*$/,
  /\/api\/locations\/\d*$/,
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
  // eslint-disable-next-line no-console
  console.log(path)
  return regexWhitelist.some(url => url.test(path))
}
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
