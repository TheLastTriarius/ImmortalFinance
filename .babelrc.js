module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ]
  const plugins = ['effector/babel-plugin']

  return {
    presets,
    plugins,
  }
}
