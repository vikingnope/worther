import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'public/**',
      'vite.config.js',
      'postcss.config.js',
      'tailwind.config.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        fetch: 'readonly',
        requestAnimationFrame: 'readonly',
        IntersectionObserver: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // Turn off prop-types validation
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern:
            'React|Header|Footer|BiSearchAlt|IoLocationSharp|FaCity|MdErrorOutline|Select',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // Add Prettier config to prevent conflicts
  prettierConfig,
];
