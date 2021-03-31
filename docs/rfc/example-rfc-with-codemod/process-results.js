/* eslint-disable no-console */
const { logToJSON } = require('../utils')

const calculatePopular = (data) =>
  data
    .reduce((all, { namedImports }) => [...all, ...namedImports], [])
    .reduce((totals, name) => {
      const current = totals.find(({ name: current }) => name === current)
      if (current) {
        current.imports++
        return totals
      }
      return [...totals, { name, imports: 1 }]
    }, [])
    .sort((a, b) => b.imports - a.imports)

const toReport = (data) => ({
  popular: calculatePopular(data),
  // files: data.map(({file}) => file),
  files: data.length,
  total: 1953,
  percentage: Math.abs(data.length / 1953) * 100,
})

const main = () => {
  logToJSON()
    .then(toReport)
    .then(console.log)
}

main()
/* eslint-enable no-console */
