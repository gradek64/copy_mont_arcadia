import * as criticalCssUtil from '../critical-css-utils'
import * as ssr from '../../handlers/server-side-renderer'
import * as readFile from '../../lib/read-file'
import * as reporter from '../../../client/lib/reporter'

const mockBrands = {
  burton: 'css content',
  dorothyperkins: 'css content',
  evans: 'css content',
  missselfridge: 'css content',
  topman: 'css content',
  topshop: 'css content',
  wallis: 'css content',
}

const expectedMockBrandPaths = [
  ['../../../public/topshop/critical.css'],
  ['../../../public/burton/critical.css'],
  ['../../../public/wallis/critical.css'],
  ['../../../public/topman/critical.css'],
  ['../../../public/evans/critical.css'],
  ['../../../public/missselfridge/critical.css'],
  ['../../../public/dorothyperkins/critical.css'],
]

describe('critical-css-utils', () => {
  let setUpCriticalCssFilesSpy
  let readFileSpy
  let reporterSpy

  beforeEach(() => {
    jest.clearAllMocks()
    setUpCriticalCssFilesSpy = jest.spyOn(ssr, 'setCriticalCssFiles')
    readFileSpy = jest.spyOn(readFile, 'default')
    reporterSpy = jest.spyOn(reporter, 'errorReport')
  })

  it('if brands are not defined then brands should default to all brands', async () => {
    readFileSpy.mockReturnValue('css content')
    await criticalCssUtil.setUpCriticalCssFiles()
    expect(readFileSpy).toHaveBeenCalledTimes(7)
    expect(readFileSpy.mock.calls).toEqual(expectedMockBrandPaths)
    expect(setUpCriticalCssFilesSpy).toBeCalledWith(mockBrands)
  })

  it('it should read all critical css files into setCriticalCssFiles', async () => {
    readFileSpy.mockReturnValue('css content')
    await criticalCssUtil.setUpCriticalCssFiles()
    expect(readFileSpy).toHaveBeenCalledTimes(7)
    expect(readFileSpy.mock.calls).toEqual(expectedMockBrandPaths)
    expect(ssr.getCriticalCssFiles()).toEqual(mockBrands)
  })

  it('it should throw error if any files cannot be read', async () => {
    const throwError = () => {
      throw new Error('error')
    }
    readFileSpy.mockImplementation(throwError)
    await criticalCssUtil.setUpCriticalCssFiles()
    expect(readFileSpy).toHaveBeenCalledTimes(7)
    expect(readFileSpy.mock.calls).toEqual(expectedMockBrandPaths)
    expect(reporterSpy).toHaveBeenCalled()
  })

  it('it should return undefined for all brands if files cannot be read', async () => {
    readFileSpy.mockReturnValue(undefined)

    await criticalCssUtil.setUpCriticalCssFiles()
    expect(readFileSpy).toHaveBeenCalledTimes(7)
    expect(setUpCriticalCssFilesSpy).toHaveBeenCalledWith({
      burton: undefined,
      dorothyperkins: undefined,
      evans: undefined,
      missselfridge: undefined,
      topman: undefined,
      topshop: undefined,
      wallis: undefined,
    })
  })
})
