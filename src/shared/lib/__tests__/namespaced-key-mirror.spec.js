import namespacedKeyMirror from '../namespaced-key-mirror'

describe('namespacedKeyMirror()', () => {
  it(`should return a prefixed "mirror" of the given object's property names`, () => {
    expect(
      namespacedKeyMirror('FISH', {
        FOO: null,
        BAR: null,
        BAZ: null,
      })
    ).toEqual({
      FOO: 'MONTY/FISH.FOO',
      BAR: 'MONTY/FISH.BAR',
      BAZ: 'MONTY/FISH.BAZ',
    })
  })
})
