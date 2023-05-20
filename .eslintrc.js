const path = require('path');
const fs = require('fs');

function parseAutoImportsDts(contents) {
  const matchResults = contents.matchAll(/^\s+const (\w+): typeof import/gm);
  return Array.from(matchResults, ([, word]) => word);
}

function uiPackageAutoImportGlobals() {
  const SRC = path.resolve(__dirname, './auto-imports.d.ts');
  const contents = fs.readFileSync(SRC, { encoding: 'utf-8' });
  const parsed = parseAutoImportsDts(contents);
  return parsed.reduce((acc, word) => {
    acc[word] = true;
    return acc;
  }, {});
}

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
  // https://github.com/antfu/unplugin-auto-import/issues/69
  globals: {
    defineProps: true,
    defineEmits: true,
    defineExpose: true,
    withDefaults: true,
    ...uiPackageAutoImportGlobals(),
  },
};
