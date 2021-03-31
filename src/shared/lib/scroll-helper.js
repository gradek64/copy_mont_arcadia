let initY
let initDelta
let currY
let currDelta
let duration
let destination
let component
let scrollFunction
let directionIncrease

const scrollToY = (step) => {
  let nextStep

  if (!step) {
    nextStep = window.scrollY || window.pageYOffset
  } else if (
    (directionIncrease && step >= destination) ||
    (!directionIncrease && step <= destination)
  ) {
    window.scrollTo(0, destination)
    nextStep = destination
  } else {
    window.scrollTo(0, step)
    nextStep = step
  }

  return nextStep
}

const scrollComponent = (step) => {
  let nextStep

  if (!step) {
    nextStep = component.scrollTop
  } else if (
    (directionIncrease && step >= destination) ||
    (!directionIncrease && step <= destination)
  ) {
    component.scrollTop = destination
    nextStep = destination
  } else {
    component.scrollTop = step
    nextStep = step
  }

  return nextStep
}

const getDelta = (speed, curr, total) => {
  if (total === 0) return 0

  const method = Math.sin
  const PI = Math.PI
  const INIT_SPEED = 10

  return Math.abs(speed * method(PI * Math.abs(total - curr)) + INIT_SPEED)
}

const runScroll = (resolve) => {
  currDelta = getDelta(initDelta, currY, Math.abs(destination - initY))

  const newY = directionIncrease ? currY + currDelta : currY - currDelta

  if (newY === currY) return

  currY = newY

  if (scrollFunction(currY) !== destination) {
    window.requestAnimationFrame(() => runScroll(resolve))
  } else {
    resolve()
  }
}

const init = (dest, time, func, parent) => {
  return new Promise((resolve) => {
    destination = dest || 0
    duration = time || 1000
    component = parent || null
    scrollFunction = func

    initY = scrollFunction()
    directionIncrease = initY < destination

    initDelta = Math.abs(destination - initY) / (duration / 60)
    currY = initY

    runScroll(resolve)
  })
}

// scroll to the top of the page
export function scrollToTop(time) {
  return init(0, time, scrollToY)
}

// scroll to a point other than the top
export function scrollToPoint(dest, time) {
  return init(dest, time, scrollToY)
}

// scroll an element to the top of the viewport
// [optional] offset parameter which is the distance the element should end up from the top
export function scrollElementIntoView(element, time, offset = 0) {
  const getYCoord = (el, y) => {
    if (el === null) return y - offset
    return getYCoord(el.offsetParent, y + el.offsetTop)
  }
  return init(getYCoord(element, 0), time, scrollToY)
}

// scroll within a container
export function scrollWithinContainer(dest, time, parent) {
  return init(dest, time, scrollComponent, parent)
}

export const scrollToFormField = (fieldName) => {
  const el = document.querySelector(`.FormComponent-${fieldName}`)
  setTimeout(() => {
    scrollElementIntoView(el, 400, 20).then(() => {
      const field = el.querySelector('input, select, button')
      if (field) field.focus()
    })
  }, 15)
}

export const scrollToTopImmediately = () => {
  window.scrollTo(0, 0)
}
