#!/usr/bin/env node

const http = require('http')

const args = require('./lib/parse-argv')(process.argv)
const exec = require('./lib/exec')
const log = require('./lib/log')
const reload = require('./lib/reload-handler')
const serve = require('./lib/serve-handler')
const watch = require('./lib/watch')

const flags = ['--port', '--watch']

const dir = args['--watch']
const port = args['--port'] || 3000

const host = 'http://localhost:' + port

const server = http.createServer(function (req, res) {
  if (req.url === '/reload') {
    reload.handler(res)
    return // stop execution
  }

  serve.handler(req, res)
})

server.listen(port, function () {
  if (typeof dir === 'string') {
    watch(dir, function (_eventType, filename) {
      for (const key in args) {
        if (flags.includes(key) === true) {
          continue // next iteration
        }

        if (filename.endsWith('.' + key.slice(2)) === true) {
          exec(args[key])
        }
      }
    })
  }

  log.info({
    message: 'Server running at ' + host
  })
})
