import configureMockStore from 'test/unit/lib/configure-mock-store'
import { setLocaleDictionary } from 'src/shared/actions/common/localisationActions'

describe('localisationReducer', () => {
  it('setLocaleDictionary sets the dictionary', () => {
    const store = configureMockStore()
    const dictionary = {
      cancel: 'Cancel',
      ok: 'Ok',
      save: 'Save',
    }
    const geoIPDictionary = { geoIPFoo: 'geoIPBar' }
    store.dispatch(setLocaleDictionary(dictionary, geoIPDictionary))
    expect(store.getState().localisation).toEqual({
      dictionary,
      geoIPDictionary,
    })
  })
})
