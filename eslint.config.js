import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'demo', 'rollup.config.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Disable base indent rule as it conflicts with @typescript-eslint
      'indent': 'off',
      '@/indent': ['error', 2],
      
      // Airbnb-style rules
      'no-underscore-dangle': ['error', { allowAfterThis: true }],
      'no-param-reassign': ['error', { props: false }],
      'no-nested-ternary': 'off',
      
      // TypeScript rules
      'no-use-before-define': 'off',
      '@/no-use-before-define': ['error'],
      'no-shadow': 'off',
      '@/no-shadow': ['error'],
      'no-unused-vars': 'off',
      '@/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
