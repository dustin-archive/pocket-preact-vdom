
import { encode } from './query'

/**
 * @function link
 * @example
 * link({
 *   to: '/foobar',
 *   query: {
 *     foo: 'bar'
 *   }
 * })
 */

const pushstateEvent = new CustomEvent('pushstate')

export default data => {
  if (data.to === history.state) {
    return history.back()
  }

  const path = location.pathname

  const to = typeof data.to === 'string' ? data.to : path
  const href = data.query ? to + encode(data.query) : to

  history.pushState(path, null, href)
  window.dispatchEvent(pushstateEvent)
}
