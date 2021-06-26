
/**
 *
 * Memoization utility
 *
 * @param cb - callback to determine when to return stale children
 * @param key - name of the memo
 * @param target - children you want to memoize
 *
 */

const EMPTY_ARR = Object.freeze([])
const INIT_STORAGE = { stale: EMPTY_ARR, target: EMPTY_ARR }

export default cb => {
  const storage = {}

  return (key, target) => {
    const ref = storage[key] = storage[key] ?? INIT_STORAGE
    return cb(target) ? (ref.target = ref.stale) : (ref.stale = target)
  }
}
