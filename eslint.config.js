import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      // Code quality rules
      'no-undef': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-extra-semi': 'warn',

      // Best practices
      eqeqeq: 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // Style consistency (handled by Prettier, but good to have)
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      '**/*.ts',
      '**/*.astro',
      'astro.config.mjs',
    ],
  },
];
