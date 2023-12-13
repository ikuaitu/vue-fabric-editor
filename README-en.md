English| [中文](https://github.com/nihaojob/vue-fabric-editor/blob/main/README.md)

Documents are translated using software,You are welcome to submit for inspection.

# vue-fabric-editor

[Demo](https://nihaojob.github.io/vue-fabric-editor/) fabric.js and Vue based image editor, can customize fonts, materials, design templates.

<div style="display:flex;justify-content:flex-start;align-items:center;margin-bottom:10px;">
    <img style='margin:0 5px' src='https://badgen.net/github/stars/nihaojob/vue-fabric-editor' />
    <img style='margin:0 5px' src='https://badgen.net/github/forks/nihaojob/vue-fabric-editor' />
</div>

<p align="center"><img src="https://user-images.githubusercontent.com/13534626/230828335-0adee0ae-b951-4171-b6ba-d2b9cd44dd6a.png" /></p>

## Existing function

- Import JSON file
- Save it as a PNG, SVG, or JSON file
- Insert SVG, image files
- Multi-element horizontal and vertical alignment
- Combine/Split Combine
- Layer and order adjustments
- undo/redo
- Background property setting
- Appearance Properties/Font Properties/Stroke/Shadow
- custom font
- Custom template material
- i18n
- Auxiliary line

## Use

### Startup

```
yarn install
yarn serve
```

### Custom font

The font-related files are in `src/assets/fonts`, put the font files in the directory, and update the newly added font name to the `font.css` and `font.js` files.

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

### Custom template

The entry of the custom template is in the `src/components/importTmpl.vue` component, and the template image and JSON file can be placed in the `public/template` file, and the data can be displayed in the component.

## Contribution Guidelines

This is a design editor project that I am using. There are many similar paid editors on the market. As a developer, I still hope to find an editor that can be easily extended and customized. If you also have needs, welcome to join us maintain.

Development introduction：[使用 fabric.js 快速开发一个图片编辑器](https://juejin.cn/post/7155040639497797645)

## plan

### Possible New Features

- [ ] svgIcon summary
- [ ] Heading Style List Template
- [ ] gradient configuration
- [x] copy paste shortcut
- [ ] Drag mode, zoom in and zoom out
- [ ] Canvas size saving
- [ ] Replace pictures, load url pictures
- [x] zoom
- [x] triangles, arrows, lines
- [ ] Tile background, Isometric background
- [ ] preview
- [ ] stroke strokeDashArray
- [x] draw lines

## License

Licensed under the MIT License.
