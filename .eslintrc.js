module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
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
    'vue/multi-word-component-names': 'off', // 开启组件需要多单词
    'vue/no-setup-props-destructure': 'off',
    'vuejs-accessibility/anchor-has-content': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
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
