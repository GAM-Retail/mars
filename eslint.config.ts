import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
export default defineConfig([
  {
    ignores: ['build', 'dist', '.react-router', 'coverage', 'node_modules'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      // typescript-eslint still not support TS 7
      // @see: https://github.com/typescript-eslint/typescript-eslint/issues/12521
      // parserOptions: {
      //   projectService: true,
      // },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
    // rules: {
    //   'no-unused-vars': 'off',
    //   '@typescript-eslint/no-unused-vars': [
    //     'warn',
    //     {
    //       varsIgnorePattern: '^_',
    //       argsIgnorePattern: '^_',
    //       caughtErrorsIgnorePattern: '^_',
    //       destructuredArrayIgnorePattern: '^_',
    //     },
    //   ],
    // },
  },
]);
