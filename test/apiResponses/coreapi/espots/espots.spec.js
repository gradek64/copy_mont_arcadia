require('@babel/register')

import { getEspots } from '../utilis/espots'

import { objectType } from '../utilis'

const espotName1 = 'CE Product espot - column 1 position 1'
const espotName2 = 'CE Product espot - column 1 position 2'
const espotName3 = 'Klarna-PDP-E-Spot-2'

describe('Espots Endpoint', () => {
  it(
    'Espots - Should return 200 status code',
    async () => {
      const result = await getEspots([espotName1])

      expect(result.statusCode).toBe(200)
    },
    30000
  )

  it(
    'Espots - Should return "espots" property within object',
    async () => {
      const result = await getEspots([espotName2])

      expect(result.body).toHaveProperty('espots')
    },
    30000
  )

  it(
    'Espots - Espots Schema',
    async () => {
      const result = await getEspots([espotName1, espotName2, espotName3])

      const espotsSchema = {
        title: 'Espot data schema',
        type: 'object',
        required: [espotName1, espotName2, espotName3],
        properties: {
          [espotName1]: objectType,
          [espotName2]: objectType,
          [espotName3]: objectType,
        },
      }
      expect(result.body.espots).toMatchSchema(espotsSchema)
    },
    30000
  )
})
