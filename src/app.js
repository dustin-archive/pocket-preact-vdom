
import { pocket } from 'pocket/index'
import { render } from 'preact'
// import { patch } from 'superfine'

const node = document.getElementById('app')
const app = init => pocket(init, view => render(view, node))
// const app = init => pocket(init, view => patch(node, view))

const Home = {
  view: (state, dispatch) => {
    return (
      <h1>{state.data}</h1>
    )
  }
}

const dispatch = app({
  state: {
    data: 'Hello World! What year is it?',
    example: 'Update me later',
    footer: {
      year: process.env.YEAR
    }
  },
  middleware: {},
  pages: {
    '/': Home
  }
})

dispatch(state => {
  return { example: 'I updated you' }
})
