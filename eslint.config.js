import { configs, plugins } from 'eslint-config-airbnb-extended';

export default [
  {
    ignores: ['dist', 'node_modules', 'demo'],
  },
  plugins.importX,
  plugins.stylistic,
  plugins.typescriptEslint,
  ...configs.base.all,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['__tests__/*.ts', '*.config.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
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

      // Allow explicit type annotations on parameters with defaults for JSR compatibility
      // JSR requires explicit types in public APIs even when inferrable
      '@typescript-eslint/no-inferrable-types': ['error', {
        ignoreParameters: true,
        ignoreProperties: false,
      }],
    },
  },
  {
    files: ['__tests__/*.ts'],
    rules: {
      'max-classes-per-file': 'off',
      'no-new': 'off',
    },
  },
  {
    files: ['*.config.ts'],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  {
    files: ['rollup.config.ts'],
    rules: {
      'no-console': 'off',
    },
  },
];
