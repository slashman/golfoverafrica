export default {
  range(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  from(array) {
    return array[this.range(0, array.length-1)];
  }
};
