[English](https://github.com/nihaojob/vue-fabric-editor/blob/main/README-en.md) | 中文

# vue-fabric-editor

[Demo](https://nihaojob.github.io/vue-fabric-editor/) 基于 fabric.js 和 Vue 的图片编辑器，可自定义字体、素材、设计模板。

![image](https://user-images.githubusercontent.com/13534626/221415964-25c1b605-4bf4-4972-b6bc-5487d85f99cc.png)


## 已有功能

- 导入 JSON 文件
- 保存为 PNG、SVG、JSON 文件
- 插入 SVG、图片文件
- 多元素水平、垂直对齐方式
- 组合/拆分组合
- 图层及顺序调整
- 撤销/重做
- 背景属性设置
- 外观属性/字体属性/描边/阴影
- 自定义字体
- 自定义模板素材
- 快捷键
- 右键菜单
- 辅助线
- 国际化

## 使用

### 启动项目

```
yarn install
yarn serve
```

### 自定义字体

字体相关的文件在`src/assets/fonts`中，将字体文件放目录下，并将新添加的字体名称更新到`font.css`和`font.js`文件中。

```js
// font.js
const cnList = [
  {
    name: '汉体',
    fontFamily: '汉体',
  },
  {
    name: '华康金刚黑',
    fontFamily: '华康金刚黑',
  },
];

const enList = [];
export default [...cnList, ...enList];
```

```css
/* font.css */
@font-face {
  font-family: '汉体';
  src: url('./cn/汉体.ttf');
}

@font-face {
  font-family: '华康金刚黑';
  src: url('./cn/华康金刚黑.ttf');
}
```

### 自定义模板

自定义模板的入口在`src/components/importTmpl.vue`组件中，可将模板图片与 JSON 文件放在`public/template`文件中，将数据拼在组件中即可展示。

## 贡献指南

项目目标是构建一个可便捷扩展、定制的设计编辑器。基于目标的拆解大致可以分为 3 个方面：

1. 功能完善：具备设计编辑器的主要能力，如图形、元素模板、保存、修改、快捷键等。
2. 架构简洁：在 fabric.js 的基础能力之上，封装出与工程、UI 组件无关的 Core 中间层。
3. UI 精致：基于 Core 中间层的能力，结合 UI 组件，让 UI 尽可能的精致好用。

项目初期更多的工作还是对基础功能积累和架构的建设，只有保证每个功能模块封闭独立、Core 中间层轻量简洁，才能达成可便捷扩展与定制的需求。

项目目前处于初期阶段，还在积累功能、架构演进中，如果恰好你有类似的需求或者对这件事情很感兴趣，欢迎你参与进来，可能比观望更有趣，你可能会获得包括但不限于以下列表的收获：

1. 基于 fabric.js 与 Vue 的编辑器架构。
2. fabric.js 库的中高阶用法。
3. 开源项目的维护经验。

注：如果遇到技术问题，期望使用 issue 讨论，它更加开放与透明，足够多的信息会让解决问题变得更高效，参考[提问的智慧](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md#%E6%8F%90%E9%97%AE%E7%9A%84%E6%99%BA%E6%85%A7)。

这是我发表在掘金社区的一篇技术笔记，会有更多的细节，[使用 fabric.js 快速开发一个图片编辑器](https://juejin.cn/post/7155040639497797645)。

目前有很多需要做的工作，比如英文文档的搭建、渐变的配置功能等，欢迎与我联系，我愿意与你进行任何问题的交流，微信：13146890191。期待你的 issue 和 PR。

## 规划

### 可能新增功能

第一阶段

- [x] 缩放
- [x] 三角形、箭头、线条
- [x] 复制 粘贴 快捷键
- [x] 拖动模式，放大缩小
- [x] 画布大小保存
- [x] 绘制线条
- [ ] svgIcon 汇总
- [ ] 标题样式列表模板
- [ ] 预览

第二阶段

- [ ] 替换图片、加载 url 图片
- [x] 渐变配置
- [ ] 平铺背景、等比例背景
- [ ] 图片裁剪
- [ ] 滤镜
- [x] 描边 strokeDashArray

## License

Licensed under the MIT License.
