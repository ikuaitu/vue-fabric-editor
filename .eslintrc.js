/*
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:22:16
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-09 09:13:33
 * @Description: file content
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'max-len': 'off',
    'no-underscore-dangle': 'off',
    'no-unde': 'off',
    'no-unused-vars': 'off',
    'block-scoped-var': 'off',
    'no-undef': 'off',
    'no-unused-expressions': 'off',
    'no-unused-var': 'off',
    'no-param-reassign': 'off',
    'no-use-before-defin': 'off',
    'no-use-before-define': 'off',
    'vars-on-top': 'off',
    'no-plusplus': 'off',
    'no-var': 'off',
    'no-continue': 'off',
    'no-multi-assign': 'off',
    'implicit-arrow-linebreak': 'off',
    'consistent-return': 'off',
    'prefer-destructuring': 'off',
    'consistent-return': 'off',
    'no-dupe-keys': 'off',
    'new-cap': 'off',
    'no-return-assign': 'off',
    'import/prefer-default-export': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
