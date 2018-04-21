export default {
  init (game) {
    this.game = game
  },
  after (millis, fn) {
    return this.game.time.events.add(millis, fn)
  },
  remove (event) {
    this.game.time.events.remove(event)
  },
  wait (millis) {
    return new Promise(resolve => this.after(millis, resolve))
  }
}
