
import escapeHtml from './escapeHtml'

const isArray = Array.isArray
const voidTags = ['img', 'input', 'meta', 'br', 'wbr', 'embed', 'area', 'base',
  'col', 'link', 'param', 'source', 'track', 'circle', 'ellipse', 'line',
  'mesh', 'path', 'polygon', 'polyline', 'rect']

function isHtmlSafe (value) {
  switch (typeof value) {
    case 'boolean': return true
    case 'number': return true
    case 'string': return true
  }
}

function joinChildren (children) {
  let target = ''

  // WARNING: When used directly this includes unescaped text in the document.
  // You should do XSS protection before this point.
  if (typeof children === 'string') {
    return children
  }

  if (isArray(children) === true) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const value = isArray(child) === true ? child.join('') : child

      if (isHtmlSafe(value) === true) {
        target += value
      }
    }
  }

  return target
}

function joinProps (props) {
  let target = ''

  for (const key in props) {
    const value = props[key]

    if (isHtmlSafe(value) === true) {
      target += ' ' + key + '="' + escapeHtml(value) + '"'
    }
  }

  return target
}

function renderNode (tag, props, ...children) {
  const target = '<' + tag + joinProps(props)

  if (voidTags.includes(tag) === true) {
    return target + '/>'
  }

  return target + '>' + joinChildren(children) + '</' + tag + '>'
}

function renderTextNode (value) {
  return escapeHtml(value)
}

export { renderNode, renderTextNode }
