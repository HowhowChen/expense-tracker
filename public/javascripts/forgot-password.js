const forgotButton = document.querySelector('#fogot-button')
const disabledBtn = document.querySelector('#disabled_btn') // 隱藏一個node，用來判斷成功寄出用
const defaultTime = 30000 // 預設冷卻時間
let start = Number(JSON.parse(localStorage.getItem('start'))) || null
const disabledBtnValue = JSON.parse(localStorage.getItem('disabledBtn')) // 用來驗證成功寄出並開始倒數

//  如果成功寄出
if (disabledBtn) {
  localStorage.setItem('disabledBtn', JSON.stringify(disabledBtn.textContent)) // 用來驗證成功寄出並開始倒數
  countBackwards()
}

// 如果還沒倒數完
if (disabledBtnValue) {
  countBackwards()
}

function countBackwards() {
  forgotButton.disabled = true // 將button鎖上
  requestAnimationFrame(count)

  function count(timestamp) {
    if(start === null) {
      start = timestamp
      updateStartAndTimestamp(start, timestamp)
    }
    updateStartAndTimestamp(start, timestamp)
    
    if(timestamp - start < defaultTime) {
      // timestamp - start 正數計時
      timestamp = Number(JSON.parse(localStorage.getItem('timestamp'))) || timestamp
      start = Number(JSON.parse(localStorage.getItem('start'))) || start
      const reciprocal = Math.ceil((defaultTime - (timestamp - start)) / 1000) // 倒計時間
      forgotButton.textContent = `再次發送(${reciprocal})`
      updateStartAndTimestamp(start, timestamp)

      requestAnimationFrame(count)
    } else {
      forgotButton.disabled = false // 將button打開
      forgotButton.textContent = '寄送驗證信'
      localStorage.clear()
    }
  }
}
// 更新start and timestamp
function updateStartAndTimestamp(start, timestamp) {
  localStorage.setItem('start', JSON.stringify(start))
  localStorage.setItem('timestamp', JSON.stringify(timestamp))
}
