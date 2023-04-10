[English](https://github.com/nihaojob/vue-fabric-editor/blob/main/README-en.md) | 中文

# vue-fabric-editor

[Demo](https://nihaojob.github.io/vue-fabric-editor/) 基于 fabric.js 和 Vue 开发的图片编辑器，可自定义字体、素材、设计模板。

![image](https://user-images.githubusercontent.com/13534626/230828335-0adee0ae-b951-4171-b6ba-d2b9cd44dd6a.png)

## 已有功能

- 导入 JSON 文件
- 保存为 PNG、SVG、JSON 文件
- 插入 SVG、图片文件
- 多元素水平、垂直对齐方式
- 字体模板
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
- 标尺
- 图片替换
- 图片滤镜
- 国际化

## 使用

### 启动项目
请先安装node.js v16，然后执行以下命令：

```
yarn install
yarn serve
```

为非web前端开发人员准备了[付费的部署教程](https://mbd.pub/o/bread/ZJeXlptw)，快速解决你的部署需求。

### 自定义素材
可自定义字体、设计模板、标题模板等，所有自定义素材在https://github.com/nihaojob/vue-fabric-editor-static 项目中保存。

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

这是我发表在掘金社区的一篇技术笔记，会有更多的细节，[使用 fabric.js 快速开发一个图片编辑器](https://juejin.cn/post/7155040639497797645)，在[讨论区](https://github.com/nihaojob/vue-fabric-editor/discussions)里有更多的编辑器选型、入门内容、常见问题、微信群内的有效讨论记录等内容。

目前有很多需要做的工作，比如英文文档的搭建、渐变的配置功能等，欢迎与我联系，我愿意与你进行任何问题的交流，微信：13146890191。期待你的 issue 和 PR 。

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
- [x] 标题样式列表模板
- [ ] 预览

第二阶段

- [x] 图片替换
- [x] 渐变配置
- [ ] 平铺背景、等比例背景
- [ ] 图片裁剪
- [x] 滤镜
- [x] 描边 strokeDashArray

## 致谢

- [color-gradient-picker-vue3](https://github.com/Qiu-Jun/color-gradient-picker-vue3) 一个 vue3 版本的渐变组件，作者[Qiu-Jun
  ](https://github.com/Qiu-Jun)。
  
## 贡献者
<!-- readme: collaborators,contributors -start -->
<table>
<tr>
    <td align="center">
        <a href="https://github.com/nihaojob">
            <img src="https://avatars.githubusercontent.com/u/13534626?v=4" width="80;" alt="nihaojob"/>
            <br />
            <sub><b>nihaojob</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Qiu-Jun">
            <img src="https://avatars.githubusercontent.com/u/24954362?v=4" width="80;" alt="Qiu-Jun"/>
            <br />
            <sub><b>Qiu-Jun</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/hudenghui">
            <img src="https://avatars.githubusercontent.com/u/17875293?v=4" width="80;" alt="hudenghui"/>
            <br />
            <sub><b>hudenghui</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/bigFace2019">
            <img src="https://avatars.githubusercontent.com/u/55651401?v=4" width="80;" alt="bigFace2019"/>
            <br />
            <sub><b>bigFace2019</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/liumingye">
            <img src="https://avatars.githubusercontent.com/u/8676207?v=4" width="80;" alt="liumingye"/>
            <br />
            <sub><b>liumingye</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/icleitoncosta">
            <img src="https://avatars.githubusercontent.com/u/3260480?v=4" width="80;" alt="icleitoncosta"/>
            <br />
            <sub><b>icleitoncosta</b></sub>
        </a>
    </td></tr>
<tr>
    <td align="center">
        <a href="https://github.com/macheteHot">
            <img src="https://avatars.githubusercontent.com/u/26652329?v=4" width="80;" alt="macheteHot"/>
            <br />
            <sub><b>macheteHot</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/slarkerino">
            <img src="https://avatars.githubusercontent.com/u/7014849?v=4" width="80;" alt="slarkerino"/>
            <br />
            <sub><b>slarkerino</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/vvbear">
            <img src="https://avatars.githubusercontent.com/u/32010827?v=4" width="80;" alt="vvbear"/>
            <br />
            <sub><b>vvbear</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/xiaozeo">
            <img src="https://avatars.githubusercontent.com/u/13568242?v=4" width="80;" alt="xiaozeo"/>
            <br />
            <sub><b>xiaozeo</b></sub>
        </a>
    </td></tr>
</table>
<!-- readme: collaborators,contributors -end -->

## License

Licensed under the MIT License.
