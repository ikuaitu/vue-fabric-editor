/*
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:22:16
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-03-08 00:07:26
 * @Description: file content
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', 'plugin:prettier/recommended'],
  // extends: ['plugin:prettier/recommended'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    ecmaVersion: 2015,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': 'off',
    'import/no-unresolved': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'consistent-return': 'off', // 强制统一返回值
    'no-param-reassign': 'off', // 参数重新分配
    'no-underscore-dangle': 'off', // 使用下划线命名
    'comma-spacing': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'max-len': 'off',
    'no-unused-expressions': 'off', // 17
    'linebreak-style': 'off',
    'vuejs-accessibility/anchor-has-content': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
