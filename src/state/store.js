import { applyMiddleware, createStore } from 'redux'
import reducers from './ducks/index.js'
import {createLogger} from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
export const history = createHistory()

const logger = createLogger()
let middleware = [...routerMiddleware(history), ReduxThunk]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger)
}
const store = createStore(
    reducers,
    applyMiddleware(...middleware)
)

export default store
