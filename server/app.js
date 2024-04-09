#!/usr/bin/env node

const config = require('./config')
const http = require('http');
const app = require('express')()

// redirect SIGINT to SIGTERM for graceful shutdown
process.once('SIGINT', () => {
  process.emitWarning('SIGINT received. Emitting SIGTERM. Send again to SIGKILL.', 'Warning', 'signal')
  process.emit('SIGTERM')
})

// a module clean-up method which mustn't stall
const stopModules = async modules => {
  for (m in modules.toReversed()) {
    if (typeof m === 'function') {
      try {
        await m()
      } catch (e) {
        // do not rethrow
        console.error(e)
      }
    }
  }
}

(async () => {

  const modules = []

  try {

    // load in sequence
    for (module in config.defaults.middleware) {
      modules
        .push(await require('./middleware/' + module)(app, config))
    }
      
    const server = http.createServer(app)
    app.set('port', process.env.PORT || config.defaults.port)

    // start server
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.once('connection', socket => socket.unref()) // used for SIGTERM close
      server.listen(port, resolve);
    })

    // graceful shutdown - stop handling new connections
    process.once('SIGTERM', () => {
      server.close(() => stopModules(modules))
    })

  } catch(e) {
    console.error(e)
    process.exitCode = 1
    stopModules(modules)
  }

})()