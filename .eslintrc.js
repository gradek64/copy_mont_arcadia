module.exports = {
  root: true,
  extends: ['airbnb', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  plugins: ['babel', 'prettier', 'jest'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
        paths: ['.'],
      },
    },
  },
  rules: {
    'arrow-body-style': 0,
    'class-methods-use-this': 0,
    'arrow-parens': [2, 'always'],
    'comma-dangle': [2, 'always-multiline'],
    'consistent-return': 0,
    'func-names': 2,
    'global-require': 0,
    'linebreak-style': [2, 'unix'],
    'max-len': 0,
    'no-confusing-arrow': 0,
    'no-console': 2,
    'no-mixed-operators': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    semi: [2, 'never'],
    'import/first': 0,
    'import/no-unresolved': 2,
    'import/prefer-default-export': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/no-danger': 2,
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/sort-comp': 0,
    'object-curly-newline': 0, // TODO from eslint upgrade, remove ASAP
    'react/default-props-match-prop-types': 0, // TODO from eslint upgrade, remove ASAP
    'jsx-a11y/anchor-is-valid': 0, // TODO from eslint upgrade, remove ASAP
    indent: 0, // TODO from eslint upgrade, remove ASAP
    'padded-blocks': 0, // TODO from eslint upgrade, remove ASAP
    'react/jsx-closing-tag-location': 0, // TODO from eslint upgrade, remove ASAP
    'function-paren-newline': 0, // TODO from eslint upgrade, remove ASAP
    'jsx-a11y/no-noninteractive-tabindex': 0, // TODO from eslint upgrade, remove ASAP
    'react/jsx-curly-brace-presence': 0, // TODO from eslint upgrade, remove ASAP
    'jsx-a11y/click-events-have-key-events': 0, // TODO from eslint upgrade, remove ASAP
    'prefer-destructuring': 0, // TODO from eslint upgrade, remove ASAP
    'jsx-a11y/label-has-for': [
      2,
      {
        required: { every: ['id'] },
      },
    ],
    'jsx-a11y/no-redundant-roles': 0, // TODO from eslint upgrade, remove ASAP
    'react/no-will-update-set-state': 0, // TODO from eslint upgrade, remove ASAP
    'react/jsx-wrap-multilines': 0, // TODO from eslint upgrade, remove ASAP
    'react/jsx-max-props-per-line': 0, // TODO from eslint upgrade, remove ASAP
    'jsx-a11y/iframe-has-title': 0, // TODO from eslint upgrade, remove ASAP
    'no-restricted-globals': 0, // TODO from eslint upgrade, remove ASAP
    'no-multi-spaces': 0, // TODO from eslint upgrade, remove ASAP
    'jsx-a11y/media-has-caption': 0, // TODO from eslint upgrade, remove ASAP
    'react/jsx-no-bind': 0, // TODO from eslint upgrade, remove ASAP
    'jsx-a11y/no-autofocus': 0, // TODO from eslint upgrade, remove ASAP
    'prefer-promise-reject-errors': 0, // TODO from eslint upgrade, remove ASAP
    camelcase: 0, // TODO from eslint upgrade, remove ASAP,
    complexity: ['warn', 20],
    'jest/no-focused-tests': 2,
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    browser: true,
    cy: true,
    Cypress: true,
    before: true,
    after: true,
    beforeEach: true,
  },
}
