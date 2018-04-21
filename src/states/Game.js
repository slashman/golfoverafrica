import Phaser from 'phaser'
import Ball from '../sprites/Ball'
import Time from '../Time'
import Territories from '../Territories'
import Players from '../Players'

export default class extends Phaser.State {
  create () {
    Time.init(this.game)

    this.initBitmaps()

    this.power = 5
    this.currentTurn = -1

    const shoot = new Phaser.Sprite(this.game, this.world.centerX, 100, 'shootBtn')
    shoot.anchor.setTo(0.5)
    shoot.inputEnabled = true
    shoot.events.onInputDown.add(() => this.shoot())
    const left = new Phaser.Sprite(this.game, this.world.centerX - 53 - 40, 100, 'leftBtn')
    left.anchor.setTo(0.5)
    left.inputEnabled = true
    left.events.onInputDown.add(() => this.rotate(-1))
    const right = new Phaser.Sprite(this.game, this.world.centerX + 53 + 40, 100, 'rightBtn')
    right.anchor.setTo(0.5)
    right.inputEnabled = true
    right.events.onInputDown.add(() => this.rotate(1))

    const plus = new Phaser.Sprite(this.game, this.world.centerX + 53 + 40, 160, 'plusBtn')
    plus.anchor.setTo(0.5)
    plus.inputEnabled = true
    plus.events.onInputDown.add(() => this.changePower(1))
    const minus = new Phaser.Sprite(this.game, this.world.centerX - 53 - 40, 160, 'minusBtn')
    minus.anchor.setTo(0.5)
    minus.inputEnabled = true
    minus.events.onInputDown.add(() => this.changePower(-1))

    this.powerText = this.game.add.text(0, 0, this.power, { font: "bold 32px Serif", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle" })
    this.powerText.setTextBounds(this.world.centerX - 100, 110, 200, 100)

    this.turnName = this.game.add.text(0, 0, '', { font: "bold 32px Serif", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle" })
    this.turnName.setTextBounds(this.world.centerX - 100, 0, 200, 100)

    this.arrow = new Phaser.Sprite(this.game, 0, 0, 'arrow')
    this.arrow.anchor.setTo(0.5, 0)
    this.arrow.visible = false

    this.eventsText = this.game.add.text(80, 700, '', { font: "bold 24px Serif", fill: "#FFF" })

    Players.forEach((p, i) => {
      p.ball = new Ball({
        game: this.game,
        x: this.world.centerX,
        y: this.world.centerY,
        asset: 'ball'
      })
      p.ball.scale.setTo(0.2)
      this.game.add.existing(p.ball)

      p.txtScore = this.game.add.text(40, 400 + i * 30, 0, { font: "bold 24px Serif", fill: "#FFF" })
      p.txtName = this.game.add.text(80, 400 + i * 30, p.country, { font: "bold 24px Serif", fill: "#FFF" })
    })
    this.game.add.existing(this.arrow)

    this.game.add.existing(shoot)
    this.game.add.existing(left)
    this.game.add.existing(right)
    this.game.add.existing(plus)
    this.game.add.existing(minus)
    this.nextTurn()
  }

  nextTurn () {
    this.currentTurn++
    if (this.currentTurn >= Players.length) {
      this.currentTurn = 0
    }
    this.currentPlayer = Players[this.currentTurn]
    this.ball = this.currentPlayer.ball
    this.relocateArrow()
    this.updatePlayerName()
  }

  updatePlayerName () {
    this.turnName.text = this.currentPlayer.country + ' Turn';
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
      if (!this.gameOver) {
        this.nextTurn()
      }
    })
    this.arrow.visible = false
  }

  checkCollision () {
    let collisionColor;
    const collided = this.bitmaps.find((b) => {
      const bmd = b.bmd
      const col = bmd.getPixel(Math.floor(this.ball.x), Math.floor(this.ball.y))
      collisionColor = col;
      return col.a > 0
    })
    if (collided) {
      const c = this.currentPlayer.color
      collided.bmd.replaceRGB(collisionColor.r, collisionColor.g, collisionColor.b, collisionColor.a, c.r, c.g, c.b, collisionColor.a)
      this.eventsText.text = this.currentPlayer.country+' occupies ' + collided.territory.name
      collided.territory.owner = this.currentPlayer.country
      this.updateScores()
    } else {
      console.log("Landed nowhere")
    }
  }

  updateScores () {
    Players.forEach((p) => {
      p.score = Territories.filter(t => t.owner === p.country).length
      p.txtScore.text = p.score
      if (p.score === 3) {
        this.eventsText.text = p.country + ' has conquered Africa!'
        this.arrow.visible = false
        this.gameOver = true
      }
    })
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
