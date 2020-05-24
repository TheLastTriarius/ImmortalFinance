module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-nested': {},
        'postcss-nested-ancestors': {},
        'postcss-advanced-variables': {},
        'postcss-preset-env': {
            browsers: 'last 2 versions'
        },
        'autoprefixer': {},
        'cssnano': {}
    },
};
