import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      
      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // TypeScript rules
      'no-unused-vars': 'off',
      '@/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      
      // Custom overrides
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/function-component-definition': 'off',
    },
  },
);
