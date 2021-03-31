import { validate } from '../../../../src/shared/lib/validator'

const l = (msg) => msg[0]

test('validate should return an empty object if all validations pass', () => {
  const schema = {
    email: 'email',
    password: 'password',
  }

  const target = {
    email: 'andreas@example.com',
    password: 'password1',
  }

  expect(validate(schema, target, l)).toEqual({})
})

test('validate should return an empty object when we pass function', () => {
  const schema = {
    email: jest.fn(() => 'im an error'),
  }

  const target = {
    email: 'someWrongEmail',
  }

  expect(validate(schema, target, l)).toEqual({ email: 'im an error' })
  expect(schema.email).toHaveBeenCalledTimes(1)
  expect(schema.email).toHaveBeenCalledWith(target, 'email', l)
})

test('validate should return fail when we pass an array', () => {
  const myspy = jest.fn()
  const schema = {
    email: ['email', () => 'error', myspy],
  }

  const target = {
    email: 'just@email.co.uk',
  }

  expect(validate(schema, target, l)).toEqual({ email: 'error' })
  expect(myspy).not.toHaveBeenCalled()
})
