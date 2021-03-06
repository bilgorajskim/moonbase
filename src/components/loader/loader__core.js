import './loader.scss'

function getPixelRatio () {
  return 'devicePixelRatio' in window ? window.devicePixelRatio : 1
}

const INITIAL_TICKS = 100

class Particle {
  constructor ({x, y, radius, color}) {
    this.radius = radius
    this.x = x
    this.y = y
    this.color = color

    this.decay = 0.01
    this.life = 1
  }

  step () {
    this.life -= this.decay
  }

  isAlive () {
    return this.life >= 0
  }

  draw (ctx) {
    const alpha = this.life >= 0 ? this.life : 0
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`

    ctx.beginPath()
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

export default class LoaderCore {
  static defaultProps = {
    size: 64,
    colors: [
      {r: 33, g: 133, b: 208},
      {r: 77, g: 167, b: 235}
    ]
  };

  static calculateGradient (startColor, stopColor, position) {
    const calculateChannelValue = (a, b) => a + Math.round((b - a) * position)

    return {
      r: calculateChannelValue(startColor.r, stopColor.r),
      g: calculateChannelValue(startColor.g, stopColor.g),
      b: calculateChannelValue(startColor.b, stopColor.b)
    }
  }

  constructor (containerNode, props) {
    this.isRunning = false

    this.props = Object.assign({}, LoaderCore.defaultProps, props)
    this.renderInNodeAndStart(containerNode)
  }

  static getPixelRatio () {
    return getPixelRatio()
  }

  setCanvasSize () {
    const pixelRatio = LoaderCore.getPixelRatio()
    const canvasSize = this.props.size * pixelRatio

    this.canvas.width = canvasSize
    this.canvas.height = canvasSize

    // Fixate canvas physical size to avoid real size scaling
    this.canvas.style.width = `${this.props.size}px`
    this.canvas.style.height = `${this.props.size}px`

    this.ctx = this.canvas.getContext('2d')

    this.ctx.scale(pixelRatio, pixelRatio)
  }

  initializeLoader () {
    this.setCanvasSize()

    this.height = this.props.size
    this.width = this.props.size

    this.particles = []

    // Configuration
    this.baseSpeed = 1.0
    this.colorIndex = 0
    this.maxRadius = 10
    this.minRadius = 6
    this.colorChangeTick = 40

    // State
    this.x = 0
    this.y = 0
    this.radius = 8
    this.hSpeed = 1.5
    this.vSpeed = 0.5
    this.radiusSpeed = 0.05
    this.tick = 0

    this.prepareInitialState(INITIAL_TICKS)
    this.isRunning = true
    this.loop()
  }

  prepareInitialState (ticks) {
    for (let i = 0; i < ticks; i++) {
      this.step()
    }
  }

  handleLimits (coord, radius, speed, limit) {
    const randomizedSpeedChange = Math.random(this.baseSpeed) - this.baseSpeed / 2

    if (coord + (radius * 2) + this.baseSpeed >= limit) {
      return -(this.baseSpeed + randomizedSpeedChange)
    } else if (coord <= this.baseSpeed) {
      return this.baseSpeed + randomizedSpeedChange
    }
    return speed
  }

  calculateNextCoordinates () {
    this.x += this.hSpeed
    this.y += this.vSpeed

    this.hSpeed = this.handleLimits(this.x, this.radius, this.hSpeed, this.width)
    this.vSpeed = this.handleLimits(this.y, this.radius, this.vSpeed, this.height)
  }

  calculateNextRadius () {
    this.radius += this.radiusSpeed

    if (this.radius > this.maxRadius || this.radius < this.minRadius) {
      this.radiusSpeed = -this.radiusSpeed
    }
  }

  getNextColor () {
    const colors = this.props.colors

    const currentColor = colors[this.colorIndex]
    const nextColor = colors[this.colorIndex + 1] || colors[0]

    return LoaderCore.calculateGradient(currentColor, nextColor, this.tick / this.colorChangeTick)
  }

  nextTick () {
    this.tick++

    if (this.tick > this.colorChangeTick) {
      this.tick = 0
      this.colorIndex++
      if (this.colorIndex > this.props.colors.length - 1) {
        this.colorIndex = 0
      }
    }
  }

  step () {
    this.nextTick()
    this.calculateNextCoordinates()
    this.calculateNextRadius()
    this.particles.forEach(particle => particle.step())

    this.particles.push(new Particle({
      x: this.x,
      y: this.y,
      radius: this.radius,
      color: this.getNextColor()
    }))
  }

  removeDeadParticles () {
    this.particles = this.particles.filter(it => it.isAlive())
  }

  draw () {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.removeDeadParticles()
    this.particles.forEach(particle => particle.draw(this.ctx))
  }

  loop () {
    this.step()
    this.draw()
    if (this.isRunning) {
      window.requestAnimationFrame(() => this.loop())
    }
  }

  updateMessage (text) {
    this.textNode.textContent = text || ''
  }

  destroy () {
    this.isRunning = false
  }

  renderInNodeAndStart (node) {
    this.canvas = document.createElement('canvas')
    this.canvas.classList.add('ring-loader__canvas')

    this.textNode = document.createElement('div')
    this.textNode.classList.add('ring-loader__text')

    this.textNode.textContent = this.props.message ? this.props.message : ''

    node.appendChild(this.canvas)
    node.appendChild(this.textNode)

    this.initializeLoader()

    return node
  }
}
