module.exports = {
    presets: [
        'module:metro-react-native-babel-preset',
        ['@babel/preset-env', { loose: true }],
        '@babel/preset-react',
        '@babel/preset-flow',
    ],
    plugins: [
        '@babel/plugin-transform-modules-commonjs',
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }]
    ],
};
