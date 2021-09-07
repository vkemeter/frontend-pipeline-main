export default {
    presets: [
        '@babel/preset-typescript',
        ['@babel/preset-env', {
            targets: {
                browsers: ['last 2 versions', 'safari >= 10.1']
            }
        }]
    ],
    'plugins': [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from'
    ]
}
