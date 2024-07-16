[文档](https://nihaojob.github.io/editorDoc/) | [English](https://github.com/nihaojob/vue-fabric-editor/blob/main/README-en.md) | 中文

# 快图设计 - vue-fabric-editor

基于 fabric.js 和 Vue 开发的插件化图片编辑器，可自定义字体、素材、设计模板、右键菜单、快捷键。

<div style="display:flex;justify-content:flex-start;align-items:center;margin-bottom:10px;">
    <img style='margin:0 5px' src='https://badgen.net/github/stars/nihaojob/vue-fabric-editor' />
    <img style='margin:0 5px' src='https://badgen.net/github/forks/nihaojob/vue-fabric-editor' />
    <img style='margin:0 5px' src="https://img.shields.io/github/license/nihaojob/vue-fabric-editor" />
</div>

- [预览](https://ikuaitu.github.io/vue-fabric-editor/#/)
- [国内 预览](https://www.kuaitu.cc/)

![image](https://user-images.githubusercontent.com/13534626/230828335-0adee0ae-b951-4171-b6ba-d2b9cd44dd6a.png)

## 特点

1. 插件化架构：可自定义素材、右键菜单、快捷键等功能，易扩展。
2. 简洁易用：以轻量、简洁为主的图形编辑器，而非大而全的在线 PS 类的重行设计工具。
3. 功能齐全：自定义模板、渐变、自定义字体等功能，满足轻量图片编辑场景。

## 已有功能

[功能介绍文章](https://juejin.cn/post/7222141882515128375) 文字 + 动图。

- 导入 JSON、PSD 文件
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

请先安装 node.js v16，及 pnpm， 然后执行以下命令：

```
pnpm i
pnpm dev
```

### 自定义素材

可自定义字体、设计模板、标题模板等，你也可以购买我整理好的字体文件 + 字体文件生成预览图片的示例代码，[购买链接](https://mbd.pub/o/bread/ZZ6cmppq)。

### 开发者服务

- **微信交流群**：我们组建了 450+人的微信项目交流群，作者和项目维护者活跃在群内，定期解答问题。
- **知识星球**：沉淀高质量常见问题、最佳实践文档，如跨域、部署、字体素材等问题，长期更新围绕在开源编辑器、fabric.js 的相关资料。
- **付费咨询**：提供 200 元/小时的咨询服务，帮你快速解决项目中遇到的问题。
- **fabric.js 代码示例**：[查看](https://mbd.pub/o/bread/ZZ6Vl55u)。
- **视频教程**：《fabric.js 入门教程》、[《使用 fabric.js 从 0 到 1 构建图片编辑器》](https://www.yuque.com/qinshaowei/fabric/qrdqudwo7sxadr4d?singleDoc#o8m1e)、[《vue-fabric-editor 开发实践》](https://mbd.pub/o/bread/ZZ6Vl5hr)。

![27d4480f-efa5-4ed3-93ed-d1a755cb41cf](https://github.com/nihaojob/vue-fabric-editor/assets/13534626/25e9075e-f751-4110-aadd-30fe453e02d9)

### 付费版本

开源版本仅前端代码，[付费版本](https://ws0gdejldw.feishu.cn/docx/GKmnddCgFokr4sxFeYNcoql1nAb)**提供完整的前后端服务，开箱即用，无须任何开发，支持 Docker 部署**，包括功能：

- 素材管理后台：可对编辑器中的字体、模板、图片素材进行便捷操作管理。
- 批量导入：字体文件、素材、PSD 模板批量导入到后台系统。
- 用户管理：支持登录/注册，用户账号禁用启用。
- 用户素材：图片素材、用户模板。
- HTTP 接口对接：微信、短信登录，API 接口登录，支持多种形式对接。
- 批量图片生成：可根据模板 + 内容，批量生成创意图片。
- 批量 AI 抠图：提供一定数量级的免费抠图服务。

我们致力于帮助企业快速、低成本构建图片编辑应用，支持定制开发，欢迎与我们联系。
![image](https://github.com/nihaojob/vue-fabric-editor/assets/13534626/d77c075c-807a-42f1-8934-e8dbfb9da0b2)

## 贡献指南

项目致力于打造一个开箱即用的 web 图片编辑器应用，同时沉淀一个介于 web 图片编辑器应用与 fabric.js 之间的封装层，期望封装层面向开发者设计，提供更简单的接口，让开发者可以轻松的实现图片应用开发。

我们离目标还有很长的距离，如果你对这件事情感兴趣，真诚的邀请你加入，我们一起沉淀 fabric.js 的最佳实践，你会得到包括不限于以下列表的收获，你只要会简单的 Git 和 Javascript 语法就可以。

- 熟悉开源协作方式，成为项目贡献者。
- Vue3 + TS 实践，边学边开发。
- fabric.js 开发，边学边开发。
- 入门单元测试，边学边开发。
- 众多的 fabric.js 开发者交流。
- 图形编辑器架构经验。

目前有很多需要做的工作，比如英文文档的搭建、SDK 拆分等，欢迎与我联系，我愿意与你进行任何问题的交流，微信：13146890191。期待你的 issue 和 PR 。

这是我发表在掘金社区关于编辑器的技术笔记，会有更多的细节：

1. [使用 fabric.js 快速开发一个图片编辑器](https://juejin.cn/post/7155040639497797645)，
2. [fabric.js 开发图片编辑器的细节实现](https://juejin.cn/post/7199849226745430076)

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
- [x] 图片裁剪
- [x] 滤镜
- [x] 描边 strokeDashArray

第三阶段

- [x] monorepo 升级 进行中
- [x] 插件化
- [x] 标尺插件
- [x] PSD 导入插件
- [x] 截图插件
- [ ] 滤镜插件
- [x] 画布插件
- [x] 其他工具函数
- [ ] @fabricEditor SDK 封装
- [ ] 基于插件开发移动端
- [ ] 基于插件开发其他图片应用
- [ ] 文档建设(中英文)

## 致谢
- [刘明野](https://github.com/liumingye)标尺功能作者。
- [palxiao](https://github.com/palxiao/poster-design/tree/main/packages/color-picker)设计编辑器的渐变组件。

## 管理员

<table>
	<tbody>
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
                    <sub><b>Qiu-Jun(求职,求内推)</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/wuchenguang1998">
                    <img src="https://avatars.githubusercontent.com/u/63847336?v=4" width="80;" alt="wuchenguang1998"/>
                    <br />
                    <sub><b>wuchenguang1998</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>

## 贡献者

<!-- readme: collaborators,contributors -start -->
<table>
	<tbody>
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
                <a href="https://github.com/wuchenguang1998">
                    <img src="https://avatars.githubusercontent.com/u/63847336?v=4" width="80;" alt="wuchenguang1998"/>
                    <br />
                    <sub><b>wuchenguang1998</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/AliceLanniste">
                    <img src="https://avatars.githubusercontent.com/u/17617116?v=4" width="80;" alt="AliceLanniste"/>
                    <br />
                    <sub><b>AliceLanniste</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ylx252">
                    <img src="https://avatars.githubusercontent.com/u/6425957?v=4" width="80;" alt="ylx252"/>
                    <br />
                    <sub><b>ylx252</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/liumingye">
                    <img src="https://avatars.githubusercontent.com/u/8676207?v=4" width="80;" alt="liumingye"/>
                    <br />
                    <sub><b>liumingye</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/momo2019">
                    <img src="https://avatars.githubusercontent.com/u/26078793?v=4" width="80;" alt="momo2019"/>
                    <br />
                    <sub><b>momo2019</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ByeWord">
                    <img src="https://avatars.githubusercontent.com/u/37115721?v=4" width="80;" alt="ByeWord"/>
                    <br />
                    <sub><b>ByeWord</b></sub>
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
                <a href="https://github.com/wohuweixiya">
                    <img src="https://avatars.githubusercontent.com/u/86701050?v=4" width="80;" alt="wohuweixiya"/>
                    <br />
                    <sub><b>wohuweixiya</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/zjc2233">
                    <img src="https://avatars.githubusercontent.com/u/43945226?v=4" width="80;" alt="zjc2233"/>
                    <br />
                    <sub><b>zjc2233</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ijry">
                    <img src="https://avatars.githubusercontent.com/u/3102798?v=4" width="80;" alt="ijry"/>
                    <br />
                    <sub><b>ijry</b></sub>
                </a>
            </td>
		</tr>
		<tr>
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
            </td>
            <td align="center">
                <a href="https://github.com/a847244052">
                    <img src="https://avatars.githubusercontent.com/u/28621500?v=4" width="80;" alt="a847244052"/>
                    <br />
                    <sub><b>a847244052</b></sub>
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
                <a href="https://github.com/skyscraperno1">
                    <img src="https://avatars.githubusercontent.com/u/63391543?v=4" width="80;" alt="skyscraperno1"/>
                    <br />
                    <sub><b>skyscraperno1</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/pengzhijian">
                    <img src="https://avatars.githubusercontent.com/u/133614612?v=4" width="80;" alt="pengzhijian"/>
                    <br />
                    <sub><b>pengzhijian</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/JiangShuQ">
                    <img src="https://avatars.githubusercontent.com/u/95730895?v=4" width="80;" alt="JiangShuQ"/>
                    <br />
                    <sub><b>JiangShuQ</b></sub>
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
                <a href="https://github.com/ddshiyu">
                    <img src="https://avatars.githubusercontent.com/u/37503208?v=4" width="80;" alt="ddshiyu"/>
                    <br />
                    <sub><b>ddshiyu</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/yehan68">
                    <img src="https://avatars.githubusercontent.com/u/40497166?v=4" width="80;" alt="yehan68"/>
                    <br />
                    <sub><b>yehan68</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/luke358">
                    <img src="https://avatars.githubusercontent.com/u/48149577?v=4" width="80;" alt="luke358"/>
                    <br />
                    <sub><b>luke358</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/xiaozeo">
                    <img src="https://avatars.githubusercontent.com/u/13568242?v=4" width="80;" alt="xiaozeo"/>
                    <br />
                    <sub><b>xiaozeo</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/x007xyz">
                    <img src="https://avatars.githubusercontent.com/u/13807549?v=4" width="80;" alt="x007xyz"/>
                    <br />
                    <sub><b>x007xyz</b></sub>
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
                <a href="https://github.com/vvbear">
                    <img src="https://avatars.githubusercontent.com/u/32010827?v=4" width="80;" alt="vvbear"/>
                    <br />
                    <sub><b>vvbear</b></sub>
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
                <a href="https://github.com/rolitter">
                    <img src="https://avatars.githubusercontent.com/u/27326998?v=4" width="80;" alt="rolitter"/>
                    <br />
                    <sub><b>rolitter</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/moJiXiang">
                    <img src="https://avatars.githubusercontent.com/u/5847011?v=4" width="80;" alt="moJiXiang"/>
                    <br />
                    <sub><b>moJiXiang</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/macheteHot">
                    <img src="https://avatars.githubusercontent.com/u/26652329?v=4" width="80;" alt="macheteHot"/>
                    <br />
                    <sub><b>macheteHot</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/liuyaojun">
                    <img src="https://avatars.githubusercontent.com/u/25071631?v=4" width="80;" alt="liuyaojun"/>
                    <br />
                    <sub><b>liuyaojun</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/jooyyy">
                    <img src="https://avatars.githubusercontent.com/u/30552622?v=4" width="80;" alt="jooyyy"/>
                    <br />
                    <sub><b>jooyyy</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/guda-art">
                    <img src="https://avatars.githubusercontent.com/u/66010134?v=4" width="80;" alt="guda-art"/>
                    <br />
                    <sub><b>guda-art</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/nanfb">
                    <img src="https://avatars.githubusercontent.com/u/56207464?v=4" width="80;" alt="nanfb"/>
                    <br />
                    <sub><b>nanfb</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/dulltackle">
                    <img src="https://avatars.githubusercontent.com/u/45963660?v=4" width="80;" alt="dulltackle"/>
                    <br />
                    <sub><b>dulltackle</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/Bamzc">
                    <img src="https://avatars.githubusercontent.com/u/10151046?v=4" width="80;" alt="Bamzc"/>
                    <br />
                    <sub><b>Bamzc</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Yangzongtai">
                    <img src="https://avatars.githubusercontent.com/u/93592008?v=4" width="80;" alt="Yangzongtai"/>
                    <br />
                    <sub><b>Yangzongtai</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Alicehhhmm">
                    <img src="https://avatars.githubusercontent.com/u/86783773?v=4" width="80;" alt="Alicehhhmm"/>
                    <br />
                    <sub><b>Alicehhhmm</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/fuqianxi">
                    <img src="https://avatars.githubusercontent.com/u/20251751?v=4" width="80;" alt="fuqianxi"/>
                    <br />
                    <sub><b>fuqianxi</b></sub>
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
                <a href="https://github.com/liucity">
                    <img src="https://avatars.githubusercontent.com/u/12006542?v=4" width="80;" alt="liucity"/>
                    <br />
                    <sub><b>liucity</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: collaborators,contributors -end -->

## License

Licensed under the MIT License.
