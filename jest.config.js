module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    moduleNameMapper: {
        '^@/tests/(.*)': '<rootDir>/tests/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
}
