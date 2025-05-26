module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // Make sure this is last to override other configs
  ],
  rules: {
    'prettier/prettier': 'error',
    // Add any project-specific ESLint rules here
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
};
