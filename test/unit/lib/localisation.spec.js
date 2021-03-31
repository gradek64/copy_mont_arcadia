import {
  localise,
  setServerSideDictionaries,
} from '../../../src/shared/lib/localisation'
import dictionaries from '../../../src/shared/constants/dictionaries'

test('localise should localise a template literal', () => {
  setServerSideDictionaries({
    topshop: {
      'en-GB': {
        'Listed ${productStock} products': 'Listed ${productStock} products', // eslint-disable-line no-template-curly-in-string
      },
    },
  })
  const productStock = '7'
  const l = localise.bind(null, 'en-gb', 'topshop')
  expect(l`Listed ${productStock} products`).toBe('Listed 7 products') // eslint-disable-line localisation
  setServerSideDictionaries(dictionaries)
})

test('localise should localise template literals with dynamic variables', () => {
  setServerSideDictionaries({
    topshop: {
      'fr-FR': {
        'Back to checkout': 'Retourner à la commande',
        'Continue to checkout': 'Continuer le paiement',
      },
    },
  })
  const actions = ['Back', 'Continue']
  const l = localise.bind(null, 'fr-fr', 'topshop')
  expect(l(`${actions[0]} to checkout`)).toBe('Retourner à la commande') // eslint-disable-line localisation
  expect(l(`${actions[1]} to checkout`)).toBe('Continuer le paiement') // eslint-disable-line localisation
  setServerSideDictionaries(dictionaries)
})

test('localise should return key if translation does not exist', () => {
  setServerSideDictionaries({
    topshop: {
      'en-GB': {},
    },
  })
  const l = localise.bind(null, 'en-gb', 'topshop')
  expect(l`non existent key`).toBe('non existent key') // eslint-disable-line localisation
  setServerSideDictionaries(dictionaries)
})
