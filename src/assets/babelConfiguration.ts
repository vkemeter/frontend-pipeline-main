export default {
    'presets': [
        ['@babel/preset-env', {
            'targets': {
                'browsers': ['last 2 versions', 'safari >= 7']
            }
        }],
        '@babel/preset-typescript'
    ],
    'plugins': [
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread'
    ]
}
