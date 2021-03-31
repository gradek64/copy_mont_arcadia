/* eslint-disable array-callback-return */
import { getFooterConfig } from '../'

const brandsAndRegions = [
  ['ts', 'uk'],
  ['ts', 'us'],
  ['ts', 'eu'],
  ['ts', 'fr'],
  ['ts', 'de'],
  ['ts', 'my'],
  ['ts', 'sg'],
  ['ts', 'th'],
  ['tm', 'uk'],
  ['tm', 'us'],
  ['tm', 'eu'],
  ['tm', 'fr'],
  ['tm', 'de'],
  ['tm', 'my'],
  ['tm', 'sg'],
  ['tm', 'th'],
  ['dp', 'uk'],
  ['dp', 'us'],
  ['dp', 'eu'],
  ['dp', 'de'],
  ['dp', 'my'],
  ['dp', 'sg'],
  ['dp', 'th'],
  ['ms', 'uk'],
  ['ms', 'us'],
  ['ms', 'eu'],
  ['ms', 'fr'],
  ['ms', 'de'],
  ['wl', 'uk'],
  ['wl', 'us'],
  ['wl', 'eu'],
  ['wl', 'de'],
  ['ev', 'uk'],
  ['ev', 'us'],
  ['ev', 'eu'],
  ['ev', 'de'],
  ['br', 'uk'],
  ['br', 'eu'],
]

const defaultObject = {
  newsletter: {},
  socialLinks: {},
  bottomContent: {},
}

describe('footer-config', () => {
  it.each(
    brandsAndRegions
  )(
    'should have footer config relevant to %p brand and %p region',
    (brand, region) => expect(getFooterConfig(brand, region)).toMatchSnapshot()
  )

  it('returns with `defaultObject` if brand or region are invalid', () => {
    expect(getFooterConfig('dorothyperkins', 'invalid-region')).toMatchObject(
      defaultObject
    )
    expect(getFooterConfig('invalid-brand', 'uk')).toMatchObject(defaultObject)
  })
})
