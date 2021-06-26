
const child_process = require('child_process') // eslint-disable-line
const log = require('./log')
const reload = require('./reload-handler')

function execCallback (error) {
  if (error) {
    console.log(error)
  }
}

module.exports = function (command) {
  const proc = child_process.exec(command, execCallback)
  let output = ''

  function handler (data) {
    output += data
  }

  proc.stdout.on('data', handler)
  proc.stderr.on('data', handler)

  proc.on('close', function () {
    log.build(command, output)
    reload.reload()
  })
}
