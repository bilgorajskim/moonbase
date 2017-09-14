import React, { PureComponent } from 'react'
import {connect} from 'react-redux'
import LoaderScreen from './loader-screen/loader-screen.js'
import {ConnectedRouter} from 'react-router-redux'
import { Route } from 'react-router-dom'
import {history} from '@app/state/store'
import Main from './pages/Main.js'
import 'normalize.css'
import './globalStyles.css'

@connect(
  state => ({
    loading: state.ui.loading
  }),
  {}
)
export default class App extends PureComponent {
  render () {
    return <ConnectedRouter history={history}>
      {this._getAreaComponent()}
    </ConnectedRouter>
  }

  _getAreaComponent () {
    if (this.props.loading) {
      return LoaderScreen.factory({message: 'Loading...'})
    }

    return <div>
      <Route exact path='/' component={Main} />
    </div>
  }

  componentDidMount () {
  }
}
