import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import solidPlugin from 'eslint-plugin-solid';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig(
  {
    ignores: ['.vinxi/**', '.output/**', 'dist/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      solid: solidPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true, // Enables strict type-aware linting
      },
    },
    rules: {
      ...solidPlugin.configs.typescript.rules,
      'solid/reactivity': 'error',
      'solid/no-destructure': 'error',
      'solid/jsx-no-undef': 'error',
    },
  },
  prettierConfig,
);