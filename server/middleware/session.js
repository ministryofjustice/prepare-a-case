const session = require('express-session')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const { promisify } = require('util')

const redisClient = redis.createClient({
  port: config.redis.port,
  password: config.redis.password,
  host: config.redis.host,
  tls: config.redis.tls_enabled === 'true' ? {} : false
})

module.exports = async app => {

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      cookie: { secure: config.https, sameSite: 'lax', maxAge: config.session.expiry * 60 * 1000 },
      secret: config.session.secret,
      resave: false, // redis implements touch so shouldn't need this
      saveUninitialized: false,
      rolling: true
    })
  )

  app.use((req, res, next) => {
    req.redisClient = {
      getAsync: promisify(redisClient.get).bind(redisClient),
      setAsync: promisify(redisClient.set).bind(redisClient)
    }
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })

}