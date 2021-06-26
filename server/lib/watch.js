
// NOTES
// + Node's recursive file watching doesn't work on Linux
// + This watch function should work on all platforms

const fs = require('fs')
const path = require('path')

function debounce (callback) {
  let last = 0

  return function (eventType, filename) {
    const now = Date.now()

    if (now > last + 200) {
      callback(eventType, filename)
    }

    last = now
  }
}

module.exports = function (root, callback) {
  const dirs = [root]
  const listener = debounce(callback)

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i]
    const children = fs.readdirSync(dir)

    for (let i = 0; i < children.length; i++) {
      const childPath = path.resolve(dir, children[i])

      // NOTE: lstat() is identical to stat(), except when a path is a symlink,
      // the link itself is stat-ed, not the file it refers to
      if (fs.lstatSync(childPath).isDirectory()) {
        dirs.push(childPath)
      }
    }

    fs.watch(dir, listener)
  }
}
