import t from 'tcomb-validation'

function tcombSchemaExtension(chai) {
  chai.Assertion.addMethod('tcombSchema', function tcombSchema(schema) {
    if (schema == null) {
      throw new Error(
        'You must supply a tcomb schema to the chai "tcombSchema" asserter'
      )
    }
    const result = t.validate(this._obj, schema)
    const errors = result.isValid()
      ? ''
      : result.errors
          .map(
            ({ expected, path }) =>
              `\t- ${path.join('/')}: should be a ${expected.displayName}`
          )
          .join('\n')
    this.assert(
      result.isValid(),
      result.isValid()
        ? `Matches schema "${schema.displayName}"`
        : `Failed to match schema "${
            schema.displayName
          }":\n ${errors}\n\nActual:\n${JSON.stringify(this._obj, null, 4)}`,
      `Expected not to match schema "${schema.displayName}"`,
      schema.displayName,
      this._obj
    )
  })
}

// eslint-disable-next-line no-undef
chai.use(tcombSchemaExtension)
