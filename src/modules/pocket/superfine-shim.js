
import { renderNode, renderTextNode } from './static/render'

const EMPTY_ARR = []
const EMPTY_OBJ = {}

/**
 *
 * Virtual nodes derived from:
 * https://github.com/jorgebucaran/superfine/blob/main/index.js
 *
 */

const virtualNode = (tag, props, children) => ({
  tag,
  props,
  key: props.key,
  children: children == null ? EMPTY_ARR : children
})

const virtualTextNode = value => ({
  tag: value,
  props: EMPTY_OBJ,
  children: EMPTY_ARR,
  type: 3
})

const node = process.env.STATIC ? renderNode : virtualNode
const text = process.env.STATIC ? renderTextNode : virtualTextNode

const h = type => (props, children) => {
  const staticProps = process.env.STATIC && typeof props === 'string'

  return Array.isArray(props) || props == null || staticProps
    ? node(type, EMPTY_OBJ, props)
    : node(type, props, children)
}

/**
 *
 * JSX pragma derived from:
 * https://github.com/zaceno/hyperapp-jsx-pragma/blob/main/index.js
 *
 */

const flatten = (children, target = []) => {
  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    if (Array.isArray(child)) {
      flatten(child, target)
    } else {
      target.push(child)
    }
  }

  return target
}

// Flattening child is bad for static rendering... why?
const jsx = (type, props, ...children) => {
  props ??= {}
  // children = flatten(children)

  if (typeof type === 'function') {
    return type(props, flatten(children))
  }

  // process.env.NODE_ENV === 'static' ???
  if (process.env.STATIC) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]

      children[i] = Array.isArray(child)
        ? child[0]
        : text(child)
    }

    return [
      node(type, props, children)
    ]
  }

  children = flatten(children)

  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    children[i] = typeof child === 'string' || typeof child === 'number'
      ? text(child)
      : child
  }

  return node(type, props, children)
}

/**
 *
 * Hyperscript functions with static rendering.
 *
 * Learn how to setup JSX with esbuild here:
 * https://esbuild.github.io/content-types/#jsx
 *
 */

export { h, text, jsx }
