import React, {PureComponent} from 'react'
import {Game} from '@app/game/index.js'

export default class GameCanvas extends PureComponent {

  constructor (props) {
    super(props)
    this.game = null
    this.canvas = null
  }

  render () {
    return <canvas ref={el => (this.canvas = el)} />
  }

  componentDidMount () {
    this.game = new Game({
      canvas: this.canvas
    })
    this.game.start()
  }
}
