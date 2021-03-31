import { isModalOpen, modalMode } from '../modalSelectors'

describe(isModalOpen.name, () => {
  it('returns true when the value is true', () => {
    const state = { modal: { open: true } }
    expect(isModalOpen(state)).toEqual(true)
  })
  it('returns false when the value is false', () => {
    const state = { modal: { open: false } }
    expect(isModalOpen(state)).toEqual(false)
  })
})

describe('modalMode', () => {
  it('returns the mode of modal', () => {
    const state = { modal: { mode: 'PlpQuickview' } }
    expect(modalMode(state)).toEqual('PlpQuickview')
  })
})
