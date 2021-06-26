
/**
 * Decodes a query string to an object.
 * @function decode
 */

const queryDelimeters = /[&=]/g

export const decode = data => {
  const query = data.slice(1).split(queryDelimeters)
  const result = {}

  for (let i = 0; i < query.length; i += 2) {
    result[query[i]] = query[i + 1]
  }

  return result
}

/**
 * Encodes an object into a query string.
 * @function encode
 */

export const encode = data => {
  let result = '?'

  for (const key in data) {
    if (data[key] != null) {
      result += key + '=' + data[key] + '&'
    }
  }

  return result.slice(0, -1)
}
