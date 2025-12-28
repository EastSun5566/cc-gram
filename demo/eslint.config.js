import { configs, plugins } from 'eslint-config-airbnb-extended';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  plugins.importX,
  plugins.stylistic,
  plugins.typescriptEslint,
  plugins.react,
  plugins.reactA11y,
  plugins.reactHooks,
  {
    plugins: {
      'react-refresh': (await import('eslint-plugin-react-refresh')).default,
    },
  },
  ...configs.react.all,
  {
    rules: {
      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Custom overrides
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/function-component-definition': 'off',
      
      // Allow figure with role="button" (used in filter selection UI)
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
    },
  },
];
