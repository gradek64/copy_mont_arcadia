import BagTransferNote, { bagTransferNoteTextKey } from '../BagTransferNote'

describe('<BagTransferNote/>', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@renders', () => {
    it('in default state', () => {
      const context = { l: jest.fn((x) => x) }
      const reactElement = BagTransferNote({}, context)
      expect(context.l).toHaveBeenCalledTimes(1)
      expect(reactElement.props.children).toEqual(bagTransferNoteTextKey)
    })
  })
})
