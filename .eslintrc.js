module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@milashensky/eslint-config',
    ],
    parserOptions: {
        parser: '@babel/eslint-parser',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'indent': ['error', 4],
        'semi': ['error', 'never'],
        'arrow-parens': ['error', 'always'],
        'import/no-dynamic-require': 0,
        'global-require': 0,
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
            ],
            env: {
                jest: true,
            },
        },
    ],
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@/tests', './tests/'],
                    ['@', './src/'],
                ],
                extensions: ['.js', '.vue'],
            },
        },
    },
}
