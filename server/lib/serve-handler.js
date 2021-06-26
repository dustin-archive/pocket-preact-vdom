
const fs = require('fs')
const path = require('path')
const log = require('./log')

const directory = path.join(process.cwd(), 'public')
const reload = path.join(__dirname, '../reload.js')

const script = fs.readFileSync(reload)
const inject = '\n\n<!-- reload script -->\n<script>' + script + '</script>'

const mime = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

function writeHandler (req, res) {
  const bytesBefore = req.socket.bytesWritten
  const start = Date.now()

  res.on('finish', function () {
    log.request({
      ms: Date.now() - start,
      bytes: req.socket.bytesWritten - bytesBefore,
      method: req.method,
      status: res.statusCode,
      path: req.url
    })
  })

  return function (url) {
    fs.readFile(url.file, (err, data) => {
      if (err) {
        res.writeHead(404)
        res.end()

        return // exit
      }

      const body = url.ext === '.html'
        ? data.toString() + inject
        : data

      res.writeHead(200)
      res.end(body)
    })
  }
}

function urlHandler (url) {
  const ext = path.extname(url)

  if (ext === '') {
    return {
      file: path.join(directory, 'index.html'),
      ext: '.html'
    }
  }

  return {
    file: path.join(directory, url),
    ext: ext
  }
}

function handler (req, res) {
  const write = writeHandler(req, res)
  const url = urlHandler(req.url)

  res.setHeader('access-control-allow-origin', '*')
  res.setHeader('content-type', mime[url.ext] || 'text/plain')

  write(url)
}

module.exports = { handler }
