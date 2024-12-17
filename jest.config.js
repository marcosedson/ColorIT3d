module.exports = {
    preset: 'react-native',
    transformIgnorePatterns: [
        'node_modules/(?!react-native|@react-native|@react-native-community|firebase|@firebase)',
    ],
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    extensionsToTreatAsEsm: ['.ts'],
};
