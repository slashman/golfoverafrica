import Phaser from 'phaser'
import Time from '../Time'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
  }

  shoot (force, direction) {
    const realForce = force * 20
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
    return Time.wait(time)
  }
}
