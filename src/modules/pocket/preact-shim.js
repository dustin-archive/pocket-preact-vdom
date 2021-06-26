
import { h } from 'preact'
import { renderNode } from './static/render'

export const jsx = process.env.STATIC ? renderNode : h
