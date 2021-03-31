import { getBranchId, startsWithValidBranchId } from './utils'

describe('utils', () => {
  describe('@getBranchId', () => {
    const JIRA_ID = 'DES-395'
    const E2E = 'E2E'
    const HOTFIX = 'HOTFIX'

    it(`should return ${JIRA_ID}`, () => {
      expect(getBranchId(`feature/${JIRA_ID}`)).toBe(JIRA_ID)
    })
    it(`should return ${E2E}`, () => {
      expect(getBranchId(`/feature/${E2E}-test`)).toBe(E2E)
    })
    it(`should return ${HOTFIX}`, () => {
      expect(getBranchId(`/feature/${HOTFIX.toLowerCase()}-test`)).toBe(HOTFIX)
    })
    it('should return null', () => {
      expect(getBranchId('/feature/test')).toBe(null)
    })
  })
  describe('@startsWithValidBranchId', () => {
    it('should return true', () => {
      expect(startsWithValidBranchId('DES-395 commit message')).toBeTruthy()
    })
    it('should return false', () => {
      expect(startsWithValidBranchId('commit message')).toBeFalsy()
    })
  })
})
