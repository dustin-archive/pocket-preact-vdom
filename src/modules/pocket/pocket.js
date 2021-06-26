
import { decode } from './router/query'

/**
 * Debounce wrapper around `window.requestAnimationFrame`
 * @function enqueue
 */

const enqueue = render => {
  let lock = false

  const callback = () => {
    lock = false
    render()
  }

  return () => {
    if (!lock) {
      lock = true
      window.requestAnimationFrame(callback)
    }
  }
}

/**
 * Collect state changes for batch updates
 * @function collect
 */

const collect = (state, render) => {
  let batch = [state]

  const schedule = enqueue(() => {
    state = Object.assign.apply(Object, batch)
    batch = [state]
    render(state)
  })

  return result => {
    batch.push(result)
    schedule()
  }
}

/**
 * Minimalist state manager with agressive optimization
 * @function pocket
 */

const pocket = (state, render) => {
  const push = collect(state, render)

  const dispatch = (action, data) => {
    const result = action(state, data)

    console.log(
      'Dispatch >>',
      action.name || '(anon)',
      typeof result === 'function' ? '(effect)' : result
    )

    if (typeof result === 'function') {
      const effect = result(dispatch)

      if (effect && effect.then) {
        return effect.then(push)
      }
    } else {
      push(result)
    }
  }

  return dispatch
}

/**
 * An action that syncs router state with `window.location`
 * @function sync
 */

const sync = ({ router }) => {
  const search = location.search

  router.query = search.startsWith('?') ? decode(search) : ''
  router.to = location.pathname

  return { router }
}

/**
 * Apply middleware to each page
 * @function middleware
 */

const middleware = (init, dispatch) => {
  const target = []

  return array => {
    array ??= []

    for (let i = 0; i < target.length; i++) {
      target[i](dispatch)
    }

    for (let i = 0; i < array.length; i++) {
      const item = init[array[i]]()

      item.onRoute(dispatch)
      target.push(item.onBeforeLeave)
    }
  }
}

/**
 * Apply route events to each page
 * @function routeEvents
 */

const routeEvents = dispatch => {
  let target

  return route => {
    if (typeof target === 'function') {
      target(dispatch)
    }

    if (typeof route.onRoute === 'function') {
      route.onRoute(dispatch)
    }

    target = route.onBeforeLeave
  }
}

/**
 * Initialize the app
 * @module pocket
 */

export default (init, patch) => {
  let route

  init.state.router = {
    query: '',
    to: '/'
  }

  const dispatch = pocket(init.state, state => {
    patch(route.view(state, dispatch))
  })

  const applyMiddleware = middleware(init.middleware, dispatch)
  const applyRouteEvents = routeEvents(dispatch)

  const listener = () => {
    dispatch(sync)

    route = init.pages[init.state.router.to] || init.pages['/missing']

    applyMiddleware(route.middleware)
    applyRouteEvents(route)
  }

  listener()

  window.addEventListener('pushstate', listener)
  window.addEventListener('popstate', listener)

  return dispatch
}
