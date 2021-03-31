let xDown = null
let yDown = null
let component
let leftFunc
let rightFunc

const touchStart = (evt) => {
  xDown = evt.touches[0].clientX
  yDown = evt.touches[0].clientY
}

const touchMove = (evt) => {
  const documentY = yDown + document.body.scrollTop

  if (
    !xDown ||
    documentY < component.offsetTop ||
    documentY > component.offsetTop + component.offsetHeight
  )
    return

  const xUp = evt.touches[0].clientX
  const yUp = evt.touches[0].clientY
  const xDiff = xDown - xUp
  const yDiff = yDown - yUp

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      leftFunc()
    } else {
      rightFunc()
    }
  } // Add else for up and down + callback swipes if needed

  xDown = null
  yDown = null
}

export function remove(comp) {
  comp.removeEventListener('touchstart', touchStart, false)
  comp.removeEventListener('touchmove', touchMove, false)
}

export function init(comp, leftCb, rightCb) {
  component = comp
  leftFunc = leftCb
  rightFunc = rightCb
  component.addEventListener('touchstart', touchStart, false)
  component.addEventListener('touchmove', touchMove, false)
}
