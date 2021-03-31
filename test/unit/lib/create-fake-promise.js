/**
 * Helper for testing promise logic
 *
 * There may be a case were you are testing a function that creates a promise but
 * you aren't able to get hold of the promise again in your test. This makes
 * it difficult to await it.
 * This module will fake the promise and provide you functions to drive the
 * behaviour of the promise synchronously.
 *
 * Example:
 *```
 * const { fakePromise, resolveNext } = createFakePromise()
 *
 * fakePromise.then(() => {
 *   return 'foo'
 * })
 *
 * resolveNext() // => 'foo'
 * ```
 *
 * @return {Object} result
 * @property {FakePromise} result.fakePromise
 */
export default function createFakePromise() {
  const callbacks = []
  const fakePromise = {
    then(cb) {
      cb.isThen = true
      callbacks.push(cb)
      return fakePromise
    },
    catch: (cb) => {
      cb.isCatch = true
      callbacks.push(cb)
      return fakePromise
    },
  }
  const resolveNext = (arg) => {
    const cb = callbacks.shift()
    if (!cb) throw new Error('No more `then` callbacks!')
    if (cb.isThen) return cb(arg)

    return resolveNext(arg)
  }
  const rejectNext = (arg) => {
    const cb = callbacks.shift()
    if (!cb) throw new Error('No more `catch` callbacks!')
    if (cb.isCatch) return cb(arg)

    return rejectNext(arg)
  }
  return {
    fakePromise,
    resolveNext,
    rejectNext,
  }
}
