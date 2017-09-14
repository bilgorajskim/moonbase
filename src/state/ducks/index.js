import { combineReducers } from 'redux'
import ui from './../ducks/ui'
import {routerReducer} from 'react-router-redux'

const reducers = combineReducers({
  ui,
  router: routerReducer
})

export default reducers
