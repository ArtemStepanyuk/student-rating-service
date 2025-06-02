module.exports = {
  env: { browser: true, es2021: true },
  extends: ['airbnb', 'plugin:react/recommended'],
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  rules: {
    indent: ['error', 4],
    'max-lines': ['error', { max: 400 }],
    'max-lines-per-function': ['error', 75],
  },
};
