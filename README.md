[文档](https://nihaojob.gitbook.io/editor/) | [English](https://github.com/nihaojob/vue-fabric-editor/blob/main/README-en.md) | 中文 

# vue-fabric-editor
基于 fabric.js 和 Vue 开发的插件化图片编辑器，可自定义字体、素材、设计模板、右键菜单、快捷键。
 

- [预览](https://nihaojob.github.io/vue-fabric-editor/) 
- [Gitee预览](https://nihaojob.gitee.io/vue-fabric-editor/#/)

![image](https://user-images.githubusercontent.com/13534626/230828335-0adee0ae-b951-4171-b6ba-d2b9cd44dd6a.png)

## 特点
1. 插件化架构：可自定义素材、右键菜单、快捷键等功能，易扩展。
2. 简洁易用：以轻量、简洁为主的图形编辑器，而非大而全的在线PS类的重行设计工具。
3. 功能齐全：自定义模板、渐变、自定义字体等功能，满足轻量图片编辑场景。

## 已有功能
[功能介绍文章](https://juejin.cn/post/7222141882515128375) 文字 + 动图。
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

为非web前端开发人员准备了[部署教程](https://t.zsxq.com/0drqSuyjY)，快速解决你的部署需求，你可以联系我进行**有偿的部署、定制开发**。

### 自定义素材
可自定义字体、设计模板、标题模板等，所有自定义素材在https://github.com/nihaojob/vue-fabric-editor-static 项目中保存。

我们通过有偿的方式积累高质量的常见问题、最佳实践文档，欢迎加入星球：

<img src="https://user-images.githubusercontent.com/13534626/231202037-18fe913f-81ab-4cd6-aa87-ada471e27586.png" width="50%" >


## 贡献指南
项目致力于打造一个开箱即用的web图片编辑器应用，同时沉淀一个介于web图片编辑器应用与fabric.js之间的封装层，期望封装层面向开发者设计，提供更简单的接口，让开发者可以轻松的实现图片应用开发。

我们离目标还有很长的距离，如果你对这件事情感兴趣，真诚的邀请你加入，我们一起沉淀fabric.js的最佳实践，你会得到包括不限于以下列表的收获，你只要会简单的Git和Javascript语法就可以。

- 熟悉开源协作方式，成为项目贡献者。
- Vue3 + TS实践，边学边开发。
- fabric.js开发，边学边开发。
- 入门单元测试，边学边开发。
- 众多的fabric.js开发者交流。
- 图形编辑器架构经验。

目前有很多需要做的工作，比如英文文档的搭建、SDK拆分等，欢迎与我联系，我愿意与你进行任何问题的交流，微信：13146890191。期待你的 issue 和 PR 。

这是我发表在掘金社区关于编辑器的技术笔记，会有更多的细节：
1. [使用 fabric.js 快速开发一个图片编辑器](https://juejin.cn/post/7155040639497797645)，
2. [fabric.js开发图片编辑器的细节实现](https://juejin.cn/post/7199849226745430076)

注：如果遇到技术问题，期望使用 issue 讨论，它更加开放与透明，足够多的信息会让解决问题变得更高效，参考[提问的智慧](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md#%E6%8F%90%E9%97%AE%E7%9A%84%E6%99%BA%E6%85%A7)。


<!-- <img src="https://user-images.githubusercontent.com/13534626/231202488-f35be6bc-617a-412e-831e-b3764466d833.jpeg" width="20%"> -->


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
- [x] 预览

第二阶段

- [x] 图片替换
- [x] 渐变配置
- [ ] 平铺背景、等比例背景
- [ ] 图片裁剪
- [x] 滤镜
- [x] 描边 strokeDashArray


第三阶段

- [ ] monorepo升级 进行中
- [x] 插件化 
- [x] 标尺插件
- [ ] 截图插件
- [ ] 滤镜插件
- [x] 画布插件
- [x] 其他工具函数
- [ ] @fabricEditor SDK封装
- [ ] 基于插件开发移动端
- [ ] 基于插件开发其他图片应用
- [ ] 文档建设(中英文)



## 致谢

- [color-gradient-picker-vue3](https://github.com/Qiu-Jun/color-gradient-picker-vue3) 一个 vue3 版本的渐变组件，作者[Qiu-Jun
  ](https://github.com/Qiu-Jun)。
- 标尺功能作者[刘明野](https://github.com/liumingye)。
  
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
        <a href="https://github.com/liumingye">
            <img src="https://avatars.githubusercontent.com/u/8676207?v=4" width="80;" alt="liumingye"/>
            <br />
            <sub><b>liumingye</b></sub>
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
        <a href="https://github.com/makeng">
            <img src="https://avatars.githubusercontent.com/u/23654388?v=4" width="80;" alt="makeng"/>
            <br />
            <sub><b>makeng</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/z09176141">
            <img src="https://avatars.githubusercontent.com/u/49260613?v=4" width="80;" alt="z09176141"/>
            <br />
            <sub><b>z09176141</b></sub>
        </a>
    </td></tr>
<tr>
    <td align="center">
        <a href="https://github.com/hudenghui">
            <img src="https://avatars.githubusercontent.com/u/17875293?v=4" width="80;" alt="hudenghui"/>
            <br />
            <sub><b>hudenghui</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/briver0825">
            <img src="https://avatars.githubusercontent.com/u/87807886?v=4" width="80;" alt="briver0825"/>
            <br />
            <sub><b>briver0825</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/a847244052">
            <img src="https://avatars.githubusercontent.com/u/28621500?v=4" width="80;" alt="a847244052"/>
            <br />
            <sub><b>a847244052</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/liucity">
            <img src="https://avatars.githubusercontent.com/u/12006542?v=4" width="80;" alt="liucity"/>
            <br />
            <sub><b>liucity</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/icleitoncosta">
            <img src="https://avatars.githubusercontent.com/u/3260480?v=4" width="80;" alt="icleitoncosta"/>
            <br />
            <sub><b>icleitoncosta</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Bamzc">
            <img src="https://avatars.githubusercontent.com/u/10151046?v=4" width="80;" alt="Bamzc"/>
            <br />
            <sub><b>Bamzc</b></sub>
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
        <a href="https://github.com/rolitter">
            <img src="https://avatars.githubusercontent.com/u/27326998?v=4" width="80;" alt="rolitter"/>
            <br />
            <sub><b>rolitter</b></sub>
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
        <a href="https://github.com/wozhi-cl">
            <img src="https://avatars.githubusercontent.com/u/25359239?v=4" width="80;" alt="wozhi-cl"/>
            <br />
            <sub><b>wozhi-cl</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/xiaozeo">
            <img src="https://avatars.githubusercontent.com/u/13568242?v=4" width="80;" alt="xiaozeo"/>
            <br />
            <sub><b>xiaozeo</b></sub>
        </a>
    </td></tr>
<tr>
    <td align="center">
        <a href="https://github.com/luke358">
            <img src="https://avatars.githubusercontent.com/u/48149577?v=4" width="80;" alt="luke358"/>
            <br />
            <sub><b>luke358</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/yehan68">
            <img src="https://avatars.githubusercontent.com/u/40497166?v=4" width="80;" alt="yehan68"/>
            <br />
            <sub><b>yehan68</b></sub>
        </a>
    </td></tr>
</table>
<!-- readme: collaborators,contributors -end -->

## License

Licensed under the MIT License.
