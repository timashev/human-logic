module.exports =  {
  env: {
    'browser': true,
    'node': true,
    'jest': true,
    'es6': true
  },
  extends: [
    'eslint:recommended',
    'last',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:jest/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'project': './tsconfig-lint.json',
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'jest'
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        'singleQuote': true, 
        'trailingComma': 'none',
        'arrowParens': 'always',
        'printWidth': 110
      }
    ],
    'max-len': ['error', 110],
    'no-var': ['error'],
    'prefer-const': 'error',
    'no-use-before-define': 'error'
  }
};
