
const map = {
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

function color (name, string) {
  return map[name] + string + '\x1b[0m'
}

const start = Date.now()

function elapsed () {
  const ms = Date.now() - start
  const timestamp = new Date(ms).toISOString().slice(11, 19)
  return '[' + timestamp + ']'
}

module.exports = {
  info: function (data) {
    console.log()
    console.log(
      color('blue', elapsed()),
      color('white', data.message)
    )
  },
  build: function (command, output) {
    console.log()
    console.log(
      color('blue', elapsed()),
      command
    )
    console.log(output.trim())
    console.log()
  },
  request: function (data) {
    const status = data.status < 400
      ? color('green', data.status)
      : color('red', data.status)

    const size = data.bytes < 1000
      ? data.bytes + 'B'
      : Math.round(data.bytes / 1000) + 'kB'

    console.log(
      color('blue', elapsed()),
      (data.ms + 'ms').padEnd(4, ' '),
      size.padStart(5, ' '),
      (data.method).padEnd(6, ' '),
      status,
      color('white', data.path)
    )
  }
}
