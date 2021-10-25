module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    'import/extensions': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
  },
};
