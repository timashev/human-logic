import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['node_modules', 'dist', 'docs', 'coverage'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      'max-len': ['error', 110],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-use-before-define': 'error'
    }
  },
  { files: ['**/*.spec.ts'], ...jest.configs['flat/recommended'] },
  prettier
);
