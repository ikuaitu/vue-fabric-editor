English| [中文](https://github.com/ikuaitu/vue-fabric-editor/blob/main/README.md)

<p align="center">
  <a href="https://pro.kuaitu.cc/index-en.html" target="_blank">  
	  <img src="https://github.com/user-attachments/assets/a0f4b8b8-a8d2-480b-b43e-49c0faaff917" width="418px" alt="Open source image editor" />
<!-- 	  <img src="https://github.com/user-attachments/assets/aff17bdf-cea6-4b7e-8091-6661ea8c4f69" width="418px" alt="Open source image editor" /> -->
  </a>
</p>

<h3 align="center"> Plugin architecture · Drag-and-drop design · Complete functions </h3>
<p align="center">Based on fabric.js and Vue developed plug-in image editor, can customize fonts, materials, design templates, right-click menu, shortcut keys</p>

<p align="center"><a href="https://ikuaitu.github.io/vue-fabric-editor/" target="_blank">Preview</a> · <a href="https://ikuaitu.github.io/doc/#/"  target="_blank">Document</a> · <a href="https://www.kuaitu.cc/"  target="_blank">Enterprise Edition Preview</a> · <a href="https://pro.kuaitu.cc/index-en.html"  target="_blank">Enterprise Edition</a></p>
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

## Introduction

Vue-Fabric-Editor is an image editor based on fabric.js and Vue, which can customize fonts, materials, design templates, right-click menus, and shortcut keys.

[GIF introduction](https://juejin.cn/post/7222141882515128375) · [Introductory video](https://www.bilibili.com/video/BV1US421A7TU/?spm_id_from=333.999.0.0)

### Features

1. **Plug-in architecture**: can be extended and developed through plug-ins, supporting right-click menus and shortcut keys.
2. **Drag-and-drop design**: a graphic editor that is mainly lightweight and simple, rather than a large and comprehensive online PS-like heavy-line design tool.
3. **Full-featured**: PSD parsing, auxiliary lines, history, gradients, custom fonts, cropping and other functions.

### Existing features

- Import JSON, PSD files
- Export PNG, SVG, JSON files
- Combine/split combinations
- Layer functions
- Gradient properties
- Appearance properties/Font properties/Stroke/Shadow
- Undo/Redo
- Shortcuts
- Right-click menu
- Auxiliary lines
- Rulers
- Custom fonts
- Custom template materials
- Insert SVG, image materials
- Horizontal and vertical alignment of multiple elements
- Background property settings
- Arrows/lines
- Brush/polygon drawing
- QR code/barcode
- Image replacement/cropping/filters
- Watermark
- Internationalization

## Use

Please install node.js v16 and pnpm first, then execute the following command:

```
pnpm i
pnpm dev
```

## Enterprise Edition

Help enterprises quickly build online design tools, **reduce enterprise R&D investment, and avoid reinventing the wheel.**

[Function Introduction](https://ws0gdejldw.feishu.cn/docx/GKmnddCgFokr4sxFeYNcoql1nAb) · [Product introduction](https://pro.kuaitu.cc/index-en.html) · [Preview](https://www.kuaitu.cc/)

The open source version only contains the front-end code, while the paid version **provides complete front-end, back-end and management background, with full functionality out of the box, and provides source code authorization and supports secondary development**.

- **Ready to use out of the box, full functionality**: Rich design capabilities, providing complete front-end and back-end functions, ready to use after deployment.
- **Plug-in architecture, easy to expand**: Based on plug-in API, quickly carry out secondary development of the editor.
- **Batch generation, fast output**: Support batch generation of images through HTTP interface and table files.
- **Drag-and-drop design, simple and easy to use**: Suitable for ordinary users, easy to get started without training.
- **Technical docking, document training**: Provide more support and efficiently complete technical docking.
- **Customized development, reduced investment**: Support the rapid completion of functional customized development and reduce R&D investment.

<a href="https://pro.kuaitu.cc/index-en.html" target="_blank">
    <img src="https://github.com/user-attachments/assets/514479be-b73e-4170-800d-f8fae4adcd5e" alt="Open source image editor" />
</a>

## Contribution guide

The project is committed to creating an out-of-the-box web image editor application, and at the same time, it will precipitate an encapsulation layer between the web image editor application and fabric.js. It is expected that the encapsulation layer will be designed for developers and provide a simpler interface so that developers can easily develop image applications.

If you are interested in this matter, we sincerely invite you to join us and grow together. You only need to know simple Git and Javascript syntax.

### Related Materials

This is a technical note I published on the Nuggets community about the editor, which will have more details:

1. [Use fabric.js to quickly develop an image editor](https://juejin.cn/post/7155040639497797645),
2. [Detailed implementation of fabric.js developing an image editor](https://juejin.cn/post/7199849226745430076)
3. [What functions can fabric.js develop an image editor to achieve? ](https://juejin.cn/post/7222141882515128375)
4. [Sharing my open source projects and open source experience](https://juejin.cn/post/7224765991896121401)
5. [What functions can fabric.js achieve with the Canvas library?](https://juejin.cn/post/7336743827827015731)
6. [Vue open source image editor](https://juejin.cn/post/7384258569590636595)
7. [Sharing of personal open source project commercialization experience](https://juejin.cn/post/7400687574967271478)
8. [Open source fabric.js image editor plug-in architecture](https://juejin.cn/post/7401071861847949339)

Note: If you encounter technical problems, you are expected to use issue Discussion, it is more open and transparent, enough information will make problem solving more efficient, refer to [The wisdom of asking questions](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md#%E6%8F%90%E9%97%AE%E7%9A%84%E6%99%BA%E6%85%A7).

<!-- <img src="https://user-images.githubusercontent.com/13534626/231202488-f35be6bc-617a-412e-831e-b3764466d833.jpeg" width="20%"> -->

## Administrator

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
		</tr>
	<tbody>
</table>

## Collaborators

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
