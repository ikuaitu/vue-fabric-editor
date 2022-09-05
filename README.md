# vue-fabric-editor
基于fabric.js和Vue的图片编辑器。

<p align="center"><img src="./src/assets/demo.png" /></p>

### 已有功能
- 导入JSON文件
- 保存为PNG、SVG、JSON文件
- 插入SVG、图片文件
- 多元素水平、垂直对齐方式
- 组合/拆分组合
- 图层及顺序调整
- 撤销/重做
- 背景属性设置
- 外观属性/字体属性/描边/阴影

### 启动项目
```
yarn install
yarn serve
```

### 正式版发布前必须完成：
- [x] 整理模板文件
- [x] 统一上传文件方法
- [x] 加载字体方法统一
- [x] 字体整理与字体下拉列表
- [ ] 统一svg图标调用
- [ ] 撤销操作优化，回退\重做有问题

### Bug修复
- [ ] 元素锁定后多选可选择，锁定时刻选中编辑
- [ ] 反转后图形变形,水平翻转图片时的bug

### 新增功能
- [ ] 标题样式列表模板
- [ ] 渐变配置
- [ ] 复制 粘贴 快捷键
- [ ] 拖动模式，放大缩小
- [ ] 画布大小保存
- [ ] 替换图片、加载url图片
- [ ] 缩放
- [ ] 三角形、箭头、线条
- [ ] 平铺背景、等比例背景
- [ ] 预览
- [ ] 描边 strokeDashArray
- [ ] 绘制线条
- [ ] 绘制图形


### 学习资料
<!-- 中文文档 -->
- https://github.com/Rookie-Birds/Fabric-Tutorial_zh-CN
- https://gitbook.cn/books/61ed420bf275ee326adaee9d/index.html
- http://fabricjs.com/docs/fabric.Canvas.html
- https://www.cnblogs.com/rachelch/p/14172947.html
- http://fabricjs.com/kitchensink
- https://www.php.cn/js-tutorial-400300.html
- https://stackoverflow.com/questions/19043219/undo-redo-feature-in-fabric-js

### 素材地址
<!-- 素材 -->
- [svg首选](https://www.svgrepo.com/)
- [svg首选2](https://www.shareicon.net/)
- [svg纯色](https://svgsilh.com/zh/)
- [svg好多元素](http://gofreedownload.net/)