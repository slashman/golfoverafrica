import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import Territories from '../Territories';

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('ball', 'assets/images/ball.png')
    this.load.image('arrow', 'assets/images/arrow.png')
    this.load.image('shootBtn', 'assets/images/shootBtn.png')
    this.load.image('leftBtn', 'assets/images/leftBtn.png')
    this.load.image('rightBtn', 'assets/images/rightBtn.png')
    this.load.image('plusBtn', 'assets/images/plusBtn.png')
    this.load.image('minusBtn', 'assets/images/minusBtn.png')
    this.load.image('tee', 'assets/images/tee.png')

    Territories.forEach(territory => this.load.image('t-'+territory.id, 'assets/images/t-'+territory.id+'.png'))
  }

  create () {
    this.state.start('Game')
  }
}
