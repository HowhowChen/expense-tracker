module.exports = {
  ifMatch: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
