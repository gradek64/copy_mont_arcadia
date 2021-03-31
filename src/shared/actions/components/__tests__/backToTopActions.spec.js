import * as actions from '../backToTopActions'

describe('Back To Top Actions', () => {
  it('setVisible(isVisible)', () => {
    expect(actions.setVisible(true)).toEqual({
      type: 'SET_BACK_TO_TOP_VISIBLE',
      isVisible: true,
    })
  })
})
