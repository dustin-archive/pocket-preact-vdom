
const crypto = require('crypto')
const clients = new Map()

function reload () {
  for (const [key] of clients) {
    clients.get(key).write('data:reload\n\n')
  }
}

function handler (res) {
  res.setHeader('content-type', 'text/event-stream')

  const id = crypto.randomBytes(6).toString('hex')

  clients.set(id, res)
  res.write('data:connect\n\n')

  const heartbeat = setInterval(function () { res.write(':\n\n') }, 90000)

  res.on('aborted', function () {
    clearInterval(heartbeat)
    clients.delete(id)
  })
}

module.exports = {
  handler: handler,
  reload: reload
}
