module.exports = (api) => {
  api.cache.using(() => (process.env.USE_COMMONJS ? 'server' : 'client'))
  const isTestOrDev = api.env('test') || api.env('development')
  const useCommonJs = process.env.USE_COMMONJS
  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          browsers: [
            'ie 11',
            'Firefox > 20',
            'iOS >= 7',
            'Android >= 4',
            'Chrome >= 43',
          ],
        },
      },
    ],
    ['@babel/preset-react'],
  ]

  const plugins = [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    ['@babel/plugin-syntax-dynamic-import'],
    ['transform-export-extensions'],
  ]

  if (useCommonJs || isTestOrDev)
    plugins.push(['@babel/plugin-transform-modules-commonjs'])

  return {
    presets,
    plugins,
  }
}
