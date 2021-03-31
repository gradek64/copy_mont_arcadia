// Small amounts of code to allow user to display monty version when told to by helpdesk.
// Separated from main code base, in case JS has crashed - hence them calling helpdesk

const onTimeElapsed = () =>
  alert(`${window.version.tag}\n${window.version.date}\n${window.version.hash}`) // eslint-disable-line

const onTouchEnd = (id) => () => clearTimeout(id)

const onTouchStart = () => {
  const timeoutId = setTimeout(onTimeElapsed, 3000)
  document.body.addEventListener('touchend', onTouchEnd(timeoutId))
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.Header').addEventListener('touchstart', onTouchStart)
})
