import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import GameCanvas from './../GameCanvas'

@connect(
  state => ({
  }))
export default class extends PureComponent {
  render () {
    return <GameCanvas />
  }
}
