/*
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:22:16
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-09 13:22:52
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
    'no-plusplus': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'consistent-return': 'off', // 强制统一返回值
    'no-param-reassign': 'off', // 参数重新分配
    'no-underscore-dangle': 'off', // 使用下划线命名
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'max-len': 'off',
    'no-unused-expressions': 'off', // 17
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
