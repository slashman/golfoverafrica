import Phaser from 'phaser'
import Time from '../Time'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
  }

  shoot (force, direction, rise) {
    console.log("Shoot", force, direction, rise);
    force = force * 20
    const endLocation = { // TODO: Include rise on the mix
      x: this.x + Math.cos(direction) * force,
      y: this.y + Math.sin(direction) * force
    }
    console.log("startLocation", { x: this.x, y: this.y });
    console.log("endLocation", endLocation);
    // TODO: Calculate time based on rise
    const time = 2000
    // TODO: Tween ball scale
    // TODO: Add easing
    this.game.add.tween(this).to({ x: endLocation.x, y: endLocation.y }, time, Phaser.Easing.None, true);
    return Time.wait(time)
  }
}
