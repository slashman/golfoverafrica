import Phaser from 'phaser'
import Ball from '../sprites/Ball'
import Time from '../Time'
import Territories from '../Territories'


export default class extends Phaser.State {
  create () {
    Time.init(this.game)

    this.initBitmaps()

    this.power = 5

    this.ball = new Ball({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'ball'
    })
    this.ball.scale.setTo(0.2)
    const shoot = new Phaser.Sprite(this.game, this.world.centerX, 40, 'shootBtn')
    shoot.anchor.setTo(0.5)
    shoot.inputEnabled = true
    shoot.events.onInputDown.add(() => this.shoot())
    const left = new Phaser.Sprite(this.game, this.world.centerX - 53 - 40, 40, 'leftBtn')
    left.anchor.setTo(0.5)
    left.inputEnabled = true
    left.events.onInputDown.add(() => this.rotate(-1))
    const right = new Phaser.Sprite(this.game, this.world.centerX + 53 + 40, 40, 'rightBtn')
    right.anchor.setTo(0.5)
    right.inputEnabled = true
    right.events.onInputDown.add(() => this.rotate(1))

    const plus = new Phaser.Sprite(this.game, this.world.centerX + 53 + 40, 100, 'plusBtn')
    plus.anchor.setTo(0.5)
    plus.inputEnabled = true
    plus.events.onInputDown.add(() => this.changePower(1))
    const minus = new Phaser.Sprite(this.game, this.world.centerX - 53 - 40, 100, 'minusBtn')
    minus.anchor.setTo(0.5)
    minus.inputEnabled = true
    minus.events.onInputDown.add(() => this.changePower(-1))

    this.powerText = this.game.add.text(0, 0, this.power, { font: "bold 32px Serif", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle" })
    this.powerText.setTextBounds(this.world.centerX - 100, 50, 200, 100)

    this.arrow = new Phaser.Sprite(this.game, this.ball.x, this.ball.y, 'arrow')
    this.arrow.anchor.setTo(0.5, 0)
    this.game.add.existing(this.ball)
    this.game.add.existing(this.arrow)
    this.game.add.existing(shoot)
    this.game.add.existing(left)
    this.game.add.existing(right)
    this.game.add.existing(plus)
    this.game.add.existing(minus)
  }

  initBitmaps () {
    this.bitmaps = Territories.map(territory => {
      var bmd = this.game.make.bitmapData(850, 873)
      bmd.draw(this.game.cache.getImage('t-'+territory.id), 0, 0)
      bmd.update()
      var sprite = this.game.add.sprite(0, 0, bmd)
      return {
        bmd: bmd,
        sprite: sprite,
        territory: territory
      }
    })
  }

  shoot () {
    this.ball.shoot(this.power, this.arrow.rotation + Math.PI / 2, 0).then(() => {
      this.relocateArrow()
      this.checkCollision()
    })
    this.arrow.visible = false
  }

  checkCollision () {
    const collided = this.bitmaps.find((b) => {
      const bmd = b.bmd
      const col = bmd.getPixel(Math.floor(this.ball.x), Math.floor(this.ball.y))
      return col.a > 0
    })
    if (collided) {
      console.log("Landed in " + collided.territory.name)
    } else {
      console.log("Landed nowhere")
    }
  }

  rotate (dir) {
    this.arrow.angle += dir * 20
  }

  relocateArrow () {
    this.arrow.x = this.ball.x
    this.arrow.y = this.ball.y
    this.arrow.visible = true
  }

  changePower (sign) {
    this.power += sign
    if (this.power > 10)
      this.power = 10
    if (this.power < 1)
      this.power = 1
    this.powerText.text = this.power
  }
}
