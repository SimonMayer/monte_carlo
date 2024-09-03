const { resolve } = require('path');

module.exports = {
    moduleFileExtensions: ['js', 'json', 'vue'],
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/tests/**/*.spec.js'],
    moduleNameMapper: {
        '^@/(.*)$': resolve(__dirname, './src/$1'), // Map the @ alias to the src folder
    },
};
