function amountValidator (amount) {
  return /^\+?[1-9][0-9]*$/.test(amount)  // 非零的正整數
}

module.exports = {
  amountValidator
}
