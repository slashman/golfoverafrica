import Phaser from 'phaser'
import Time from '../Time'
import Random from '../Random'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
  }

  shoot (force, direction, player) {
    let forceScale = 20
    if (player.logistics === 1) {
      forceScale = 15
    } else if (player.logistics === 3) {
      forceScale = 25
    }
    let realForce = force * forceScale
    realForce = realForce * (100 + Random.range(0, 30)) / 100

    let directionVariationRange = 7
    if (player.leadership === 1) {
      directionVariationRange = 10
    } else if (player.logistics === 3) {
      directionVariationRange = 5
    }
    let variation = Random.range(-directionVariationRange, directionVariationRange)
    variation = variation * (Math.PI / 180)
    direction = direction + variation

    const endLocation = {
      x: this.x + Math.cos(direction) * realForce,
      y: this.y + Math.sin(direction) * realForce
    }
    const time = 2000 - (10 - force) * 100
    if (force > 2) {
      const toScale = (1 / 10) * force
      this.game.add.tween(this.scale).to({ x: toScale, y: toScale }, time / 2, Phaser.Easing.Sinusoidal.Out, true, 0, 0, true)
    }
    this.game.add.tween(this).to({ x: endLocation.x, y: endLocation.y }, time, Phaser.Easing.Sinusoidal.Out, true)
    return Time.wait(time + 500)
  }
}
