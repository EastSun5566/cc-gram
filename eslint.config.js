import { configs, plugins } from 'eslint-config-airbnb-extended';

export default [
  {
    ignores: ['dist', 'node_modules', 'demo', 'rollup.config.ts'],
  },
  plugins.importX,
  plugins.stylistic,
  plugins.typescriptEslint,
  ...configs.base.all,
  {
    rules: {
      // Custom overrides from original config
      'no-underscore-dangle': ['error', { allowAfterThis: true }],
      'no-param-reassign': ['error', { props: false }],
      'no-nested-ternary': 'off',
      'import-x/extensions': 'off',
      
      // Allow default export with name "default"
      'no-restricted-exports': ['error', {
        restrictedNamedExports: ['then'], // Only restrict 'then' as Airbnb does
      }],
      
      // Allow return values from promise executor
      'no-promise-executor-return': 'off',
      
      // Increase max line length to match existing code
      '@stylistic/max-len': ['error', {
        code: 120,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
    },
  },
];
