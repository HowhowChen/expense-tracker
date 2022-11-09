const forgotButton = document.querySelector('#fogot-button')
const disabledBtn = document.querySelector('#disabled_btn') // 隱藏一個node，用來判斷成功寄出用
const countDownTime = Number(JSON.parse(localStorage.getItem('countDownTime'))) || 30000 // 冷卻時間預設30秒
const disabledBtnValue = JSON.parse(localStorage.getItem('disabledBtn')) // 用來驗證成功寄出並開始倒數

//  如果成功寄出
if (disabledBtn) {
  localStorage.setItem('disabledBtn', JSON.stringify(disabledBtn.textContent)) // 用來驗證成功寄出並開始倒數
  countDown()
}

// 如果還沒倒數完
if (disabledBtnValue) {
  countDown()
}

function countDown() {
  forgotButton.disabled = true // 將button鎖上
  requestAnimationFrame(count)

  function count(timestamp) {
    if(timestamp < countDownTime) {
      const reciprocal = Math.ceil((countDownTime - timestamp) / 1000) // 倒計時間
      forgotButton.textContent = `再次發送(${reciprocal})`
      localStorage.setItem('countDownTime', JSON.stringify(reciprocal * 1000))

      requestAnimationFrame(count)
    } else {
      forgotButton.disabled = false // 將button打開
      forgotButton.textContent = '寄送驗證信'
      localStorage.clear()
    }
  }
}
