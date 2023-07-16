<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-16 12:55:12
 * @Description: 导入JSON文件
-->

<template>
  <div style="display: inline-block">
    <Button @click="insert" type="text" size="small">{{ $t('import_files') }}</Button>
  </div>
</template>

<script name="ImportJson" setup>
import useSelect from '@/hooks/select';
// import { selectFiles, downFontByJSON } from '@/utils/utils';

const { canvasEditor } = useSelect();
const insert = () => {
  canvasEditor.insert();
  // selectFiles({ accept: '.json' }).then((files) => {
  //   const [file] = files;
  //   const reader = new FileReader();
  //   reader.readAsText(file, 'UTF-8');
  //   reader.onload = () => {
  //     insertSvgFile(reader.result);
  //   };
  // });
};

// function insertSvgFile(jsonFile) {
//   // 加载字体后导入
//   downFontByJSON(jsonFile).then(() => {
//     canvas.c.loadFromJSON(jsonFile, () => {
//       canvas.c.renderAll.bind(canvas.c);
//       setTimeout(() => {
//         const workspace = canvas.c.getObjects().find((item) => item.id === 'workspace');
//         workspace.set('selectable', false);
//         workspace.set('hasControls', false);
//         canvas.c.requestRenderAll();
//         canvas.editor.editorWorkspace.setSize(workspace.width, workspace.height);
//         canvas.c.renderAll();
//         canvas.c.requestRenderAll();
//       }, 100);
//     });
//   });
// }
</script>
