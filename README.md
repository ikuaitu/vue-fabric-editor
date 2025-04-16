<!--
 * @Author: 秦少卫
 * @Date: 2024-09-11 17:07:42
 * @LastEditors: 秦少卫
 * @LastEditTime: 2025-02-20 14:10:05
 * @Description: file content
-->

[English](https://github.com/ikuaitu/vue-fabric-editor/blob/main/README-en.md)| 中文

<p align="center">
  <a href="https://pro.kuaitu.cc" target="_blank">
    <img src="https://github.com/user-attachments/assets/4e519179-8d19-41cc-ad2b-a1d7ebc63836" width="318px" alt="开源图片编辑器" />
  </a>
</p>

<h3 align="center">开源图片编辑器 · 插件化架构 · 拖拽式设计 · 功能完善 </h3>
<p align="center">基于 fabric.js 和 Vue 开发的插件化图片编辑器，可自定义字体、素材、设计模板、右键菜单、快捷键</p>

<p align="center"><a href="https://ikuaitu.github.io/vue-fabric-editor/" target="_blank">演示</a> · <a href="https://ikuaitu.github.io/doc/#/"  target="_blank">文档</a> · <a href="https://www.kuaitu.cc/"  target="_blank">商业版演示</a> · <a href="https://pro.kuaitu.cc/"  target="_blank">商业版介绍</a></p>
<br />

<p align="center">
  <a href="" target="_blank">
    <img src="https://img.shields.io/github/stars/ikuaitu/vue-fabric-editor?style=flat" alt="stars" />
  </a>
	
  <a href="" target="_blank">
    <img src="https://img.shields.io/github/forks/ikuaitu/vue-fabric-editor?style=flat" alt="stars" />
  </a>
	
  <a href="https://github.com/ikuaitu/vue-fabric-editor/graphs/contributors" target="_blank">
    <img src="https://img.shields.io/github/contributors/ikuaitu/vue-fabric-editor" alt="contributors" />
  </a>
  <a href="https://github.com/ikuaitu/vue-fabric-editor?tab=MIT-1-ov-file" target="_blank">
    <img src="https://img.shields.io/github/license/ikuaitu/vue-fabric-editor?style=flat" alt="license" />
  </a>
  <a href="https://www.kuaitu.cc/" target="_blank">
    <img src="https://img.shields.io/website?url=http%3A%2F%2Fpro.kuaitu.cc%2F" alt="快图设计网站" />
  </a>
</p>

<br>
<p align="center">
  <a href="" >
    <img src="https://github.com/user-attachments/assets/2a41f5ac-2211-45b8-b683-ffbdf72e6d8b" alt="演示" />
  </a>
</p>

## 简介

快图设计，vue-fabric-editor 是一款基于 fabric.js 和 Vue 开发的图片编辑器，可自定义字体、素材、设计模板、右键菜单、快捷键。

[动图介绍](https://juejin.cn/post/7222141882515128375) · [介绍视频](https://www.bilibili.com/video/BV1US421A7TU/?spm_id_from=333.999.0.0)

### 特点

1. **插件化架构**：可通过插件的进行扩展开发，支持右键菜单和快捷键。
2. **拖拽式设计**：以轻量、简洁为主的图形编辑器，而非大而全的在线 PS 类的重行设计工具。
3. **功能完善**：PSD 解析、辅助线、历史记录、渐变、自定义字体、裁剪等功能。

### 已有功能

- 导入 JSON、PSD 文件
- 导出 PNG、SVG、JSON 文件
- 组合/拆分组合
- 图层功能
- 渐变属性
- 外观属性/字体属性/描边/阴影
- 撤销/重做
- 快捷键
- 右键菜单
- 辅助线
- 标尺
- 自定义字体
- 自定义模板素材
- 插入 SVG、图片素材
- 多元素水平、垂直对齐方式
- 背景属性设置
- 箭头/线条
- 画笔/多边形绘制
- 二维码/条形码
- 图片替换/裁剪/滤镜
- 水印
- 国际化

## 使用

请先安装 node.js v18-v20，及 pnpm 8.4.0， 然后执行以下命令：

```shell
// 安装pnpm
npm install -g pnpm@8.4.0

// 中国使用淘宝代理
// npm install -g pnpm@8.4.0 --registry=https://registry.npmmirror.com
pnpm i
pnpm dev
```
重要：必须使用pnpm 8.x，高版本pnpm会导致依赖不一致出现页面运行报错。

## 开发者服务

- **微信交流群**：我们组建了多个微信项目交流群，作者和项目维护者活跃在群内，定期解答问题。
- **fabric.js 中文教程**：[https://blog.kuaitu.cc](https://blog.kuaitu.cc/)。
- **知识星球**：长期更新开源编辑器与 fabric.js 的相关资料，沉淀最佳实践、开发经验分享、代码示例等。
  <img src="https://github.com/nihaojob/vue-fabric-editor/assets/13534626/25e9075e-f751-4110-aadd-30fe453e02d9" width="500px" alt="二维码" />

## 付费版本

帮助企业快速搭建在线设计工具，**减少企业研发投入，避免重复造轮子。**

[功能介绍](https://ws0gdejldw.feishu.cn/docx/GKmnddCgFokr4sxFeYNcoql1nAb) · [产品介绍](http://pro.kuaitu.cc/) · [演示](https://www.kuaitu.cc/)

开源版本仅前端代码，付费版本**提供完整的前后端、管理后台，功能完整开箱即用，提供源码授权、支持二次开发**。

- **开箱即用，功能完整**：设计能力丰富，提供完整前台、后台功能，部署即可使用。
- **插件架构，扩展方便**：基于插件化 API，快速对编辑器进行二次开发。
- **批量生成，快速出图**：支持通过 HTTP 接口、表格文件批量生成图片。
- **拖拽式设计，简单易用**：适合普通用户操作，无需培训轻松上手。
- **全平台适配**：PC 版本、H5 版本支持各种应用场景。
- **技术对接，文档培训**：提供更多的支持，高效完成技术对接。
- **定制开发，减少投入**：支持快速完成功能定制开发，减少研发投入。
  <a href="https://pro.kuaitu.cc" target="_blank">
  <img src="https://github.com/user-attachments/assets/5303395b-247d-45be-a411-ef27a389156c" alt="开源图片编辑器" />
  </a>

## 贡献指南

项目致力于打造一个开箱即用的 web 图片编辑器应用，同时沉淀一个介于 web 图片编辑器应用与 fabric.js 之间的封装层，期望封装层面向开发者设计，提供更简单的接口，让开发者可以轻松的实现图片应用开发。

如果你对这件事情感兴趣，真诚的邀请你加入，我们一起成长，你只要会简单的 Git 和 Javascript 语法就可以。

[【提交代码送赢雷蛇游戏鼠标】](https://github.com/ikuaitu/vue-fabric-editor/issues/526)

### 相关资料

这是我发表在掘金社区关于编辑器的技术笔记，会有更多的细节：

1. [使用 fabric.js 快速开发一个图片编辑器](https://juejin.cn/post/7155040639497797645)，
2. [fabric.js 开发图片编辑器的细节实现](https://juejin.cn/post/7199849226745430076)
3. [fabric.js 开发图片编辑器可以实现哪些功能？多图](https://juejin.cn/post/7222141882515128375)
4. [我的开源项目与开源经历分享](https://juejin.cn/post/7224765991896121401)
5. [Canvas 库 fabric.js 可以实现哪些功能？ 动图介绍](https://juejin.cn/post/7336743827827015731)
6. [Vue 开源图片编辑器](https://juejin.cn/post/7384258569590636595)
7. [个人开源项目商业化经验分享](https://juejin.cn/post/7400687574967271478)
8. [开源 fabric.js 图片编辑器的插件化架构](https://juejin.cn/post/7401071861847949339)

注：如果遇到技术问题，期望使用 issue 讨论，它更加开放与透明，足够多的信息会让解决问题变得更高效，参考[提问的智慧](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md#%E6%8F%90%E9%97%AE%E7%9A%84%E6%99%BA%E6%85%A7)。

<!-- <img src="https://user-images.githubusercontent.com/13534626/231202488-f35be6bc-617a-412e-831e-b3764466d833.jpeg" width="20%"> -->

## 致谢

- [刘明野](https://github.com/liumingye)标尺功能作者。
- [palxiao](https://github.com/palxiao/poster-design/tree/main/packages/color-picker)设计编辑器的渐变组件。

## 友情赞助

<a href="https://github.com/wangyuan389/mall-cook" target="_blank">
    <img src="https://www.sunmao-design.top/sunmao/admin/assets/logo.896aa176.png" width="50px" alt="开源图片编辑器" />    
</a>

<a href="https://github.com/rubickCenter/rubick" target="_blank">
    <img src="https://raw.githubusercontent.com/rubickCenter/rubick/refs/heads/master/public/logo.png" width="50px" alt="开源图片编辑器" />    
</a>

<a href="https://github.com/leaferjs/leafer-ui" target="_blank">
    <img src="https://github.com/user-attachments/assets/0c6ed3c4-bc2b-49fb-854d-f9ed75a96121" width="50px" alt="开源图片编辑器" />    
</a>

## 管理员

<!-- readme: collaborators -start -->

<!-- readme: collaborators -end -->

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

Licensed under the [MIT](./LICENSE) License.
