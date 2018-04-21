import Phaser from 'phaser'
import Ball from '../sprites/Ball'
import Time from '../Time'
import Territories from '../Territories'
import Players from '../Players'
import Random from '../Random'

const WIN_SCORE = 10;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export default class extends Phaser.State {
  create () {
    Time.init(this.game)
    this.month = 11;
    this.year = 1984;

    this.initBitmaps()
    this.inputBlocked = false;
    this.power = 5
    this.currentTurn = -1
    this.startPosition = {
      x: 302,
      y: 425
    }
    //this.game.add.image(this.startPosition.x - 18, this.startPosition.y - 10, 'tee')
    const shoot = new Phaser.Sprite(this.game, 40 + 60 + 10, 600, 'shootBtn')
    shoot.inputEnabled = true
    shoot.events.onInputDown.add(() => this.shoot())
    const left = new Phaser.Sprite(this.game, 40, 600, 'leftBtn')
    left.inputEnabled = true
    left.events.onInputDown.add(() => this.rotate(-1))
    const right = new Phaser.Sprite(this.game, 40 + 60 + 10 + 106 + 10, 600, 'rightBtn')
    right.inputEnabled = true
    right.events.onInputDown.add(() => this.rotate(1))

    const plus = new Phaser.Sprite(this.game, 40 + 60 + 10 + 106 + 10, 660, 'plusBtn')
    plus.inputEnabled = true
    plus.events.onInputDown.add(() => this.changePower(1))
    const minus = new Phaser.Sprite(this.game, 40, 660, 'minusBtn')
    minus.inputEnabled = true
    minus.events.onInputDown.add(() => this.changePower(-1))

    this.powerText = this.game.add.text(0, 0, this.power, { font: "bold 32px Serif", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle" })
    this.powerText.setTextBounds(40 + 20, 635, 200, 100)
    this.dateText = this.game.add.text(700 , 780, '', { font: "bold 18px Serif", fill: "#FFF" })
    this.turnName = this.game.add.text(40, 720, '', { font: "bold 24px Serif", fill: "#F00" })
    this.leaderTxt = this.game.add.text(40, 440, '', { font: "bold 32px Serif", fill: "#FFF" })
    this.titleTxt = this.game.add.text(40, 480, '', { font: "bold 18px Serif", fill: "#FFF" })
    this.game.add.text(40, 510, 'Military', { font: "bold 18px Serif", fill: "#FFF" })
    this.game.add.text(40, 530, 'Logistics', { font: "bold 18px Serif", fill: "#FFF" })
    this.game.add.text(40, 550, 'Leadership', { font: "bold 18px Serif", fill: "#FFF" })
    this.militaryTxt = this.game.add.text(200, 510, '', { font: "bold 18px Serif", fill: "#FFF" })
    this.logisticsTxt = this.game.add.text(200, 530, '', { font: "bold 18px Serif", fill: "#FFF" })
    this.leadershipTxt = this.game.add.text(200, 550, '', { font: "bold 18px Serif", fill: "#FFF" })

    this.arrow = new Phaser.Sprite(this.game, 0, 0, 'arrow')
    this.arrow.anchor.setTo(0.5, 0)
    this.arrow.visible = false

    this.eventsText = this.game.add.text(40, 780, '', { font: "bold 18px Serif", fill: "#FFF" })

    Players.forEach((p, i) => {
      p.ball = new Ball({
        game: this.game,
        x: this.startPosition.x,
        y: this.startPosition.y,
        asset: 'ball'
      })
      p.ball.scale.setTo(0.2)
      this.game.add.existing(p.ball)

      p.txtScore = this.game.add.text(760, 37 + i * 30, 0, { font: "bold 24px Serif", fill: "#FFF" })
      this.game.add.image(700, 40 + i * 30, p.id)
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
      this.month++;
      if (this.month === 13) {
        this.month = 1;
        this.year++;
      }

    }
    this.currentPlayer = Players[this.currentTurn]
    if (this.currentPlayer.selectedPower) {
      this.power = this.currentPlayer.selectedPower
    } else {
      this.power = 5
    }

    if (this.currentPlayer.selectedRotation) {
      this.arrow.rotation = this.currentPlayer.selectedRotation
    } else {
      this.arrow.rotation = (Math.PI / 4) * 5
    }
    this.powerText.text = this.power
    this.ball = this.currentPlayer.ball
    this.relocateArrow()
    this.updatePlayerName()
  }

  updatePlayerName () {
    this.turnName.text = this.currentPlayer.country + '\'s Turn';

    this.leaderTxt.text = this.currentPlayer.name;
    this.titleTxt.text = this.currentPlayer.title;
    this.militaryTxt.text = this.currentPlayer.military;
    this.logisticsTxt.text = this.currentPlayer.logistics;
    this.leadershipTxt.text = this.currentPlayer.leadership;

    this.dateText.text = MONTHS[this.month - 1]+", "+this.year;
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
    if (this.inputBlocked) return
    this.inputBlocked = true
    this.ball.oldX = this.ball.x
    this.ball.oldY = this.ball.y
    this.currentPlayer.selectedPower = this.power;
    this.currentPlayer.selectedRotation = this.arrow.rotation;
    this.ball.shoot(this.power, this.arrow.rotation + Math.PI / 2, this.currentPlayer).then(() => {
      this.relocateArrow()
      this.checkCollision()
      if (!this.gameOver) {
        this.nextTurn()
        this.inputBlocked = false;
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
      this.invadeTerritory(collided, this.currentPlayer, collisionColor)
    } else {
      this.eventsText.text = this.currentPlayer.country + ' falls into a hazard'
      this.currentPlayer.ball.x = this.currentPlayer.ball.oldX
      this.currentPlayer.ball.y = this.currentPlayer.ball.oldY
    }
  }

  invadeTerritory (area, player, collisionColor) {
    if (!area.territory.owner) {
      this.occupyTerritory(area, player, collisionColor)
    } else if (area.territory.owner === player.country) {
      // Do nothing
    } else {
      const defender = Players.find(p => p.country === area.territory.owner)
      let defensePower = Random.range(1, defender.military * 20) * (100 + Random.range(0, 50)) / 100
      let attackPower = Random.range(1, player.military * 20) * (100 + Random.range(0, 30)) / 100
      if (attackPower > defensePower) {
        this.occupyTerritory(area, player, collisionColor)
      } else {
        this.eventsText.text = defender.country + ' repels ' + player.country + ' invasion'
      }
    }
  }

  occupyTerritory (area, player, collisionColor) {
    const c = player.color
    area.bmd.replaceRGB(collisionColor.r, collisionColor.g, collisionColor.b, collisionColor.a, c.r, c.g, c.b, collisionColor.a)
    this.eventsText.text = player.country + ' occupies ' + area.territory.name
    area.territory.owner = player.country
    this.updateScores()
  }

  updateScores () {
    Players.forEach((p) => {
      p.score = Territories.filter(t => t.owner === p.country).length
      p.txtScore.text = p.score
      if (p.score === WIN_SCORE) {
        this.eventsText.text = p.country + ' has conquered Africa!'
        this.arrow.visible = false
        this.gameOver = true
      }
    })
  }

  rotate (dir) {
    if (this.inputBlocked) return;
    this.arrow.angle += dir * 20
  }

  relocateArrow () {
    this.arrow.x = this.ball.x
    this.arrow.y = this.ball.y
    this.arrow.visible = true
  }

  changePower (sign) {
    if (this.inputBlocked) return;
    this.power += sign
    if (this.power > 10)
      this.power = 10
    if (this.power < 1)
      this.power = 1
    this.powerText.text = this.power
  }
}
