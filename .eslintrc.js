module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'cz-'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'class',
        format: ['PascalCase'],
      },
      {
        selector: 'function',
        format: ['camelCase'],
      },
    ],
    'max-lines-per-function': [
      'warn',
      {
        max: 25,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'import/order': [
      'error',
      {
        groups: [
          'type',
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'unknown',
        ],
        warnOnUnassignedImports: true,
      },
    ],
  },
};
