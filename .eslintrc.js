module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: [
      'airbnb-base',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/typescript',
      ],
    parserOptions: {
        parser: [
          'babel-eslint',
          '@typescript-eslint/parser',
        ],
    },
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/indent': ['error', 2],
      'no-underscore-dangle': ['error', { allowAfterThis: true }],
      'no-param-reassign': ['error', { props: false }],
      'no-nested-ternary': 'off',
      'import/extensions': 'off',
    },
};