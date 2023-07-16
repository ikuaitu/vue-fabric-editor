<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-16 12:51:11
 * @Description: 插入SVG元素
-->

<template>
  <div style="display: inline-block">
    <Dropdown transfer-class-name="fix" @on-click="insertTypeHand">
      <a href="javascript:void(0)">
        {{ $t('insertFile.insert') }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <template #list>
        <DropdownMenu>
          <!-- 图片 -->
          <DropdownItem name="insertImg">{{ $t('insertFile.insert_picture') }}</DropdownItem>
          <!-- SVG -->
          <DropdownItem name="insertSvg">{{ $t('insertFile.insert_SVG') }}</DropdownItem>
          <!-- SVG 字符串 -->
          <DropdownItem name="insertSvgStrModal">{{ $t('insertFile.insert_SVGStr') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
    <!-- 插入字符串svg元素 -->
    <Modal
      v-model="state.showModal"
      :title="$t('insertFile.modal_tittle')"
      @on-ok="insertTypeHand('insertSvgStr')"
      @on-cancel="showModal = false"
    >
      <Input
        v-model="state.svgStr"
        show-word-limit
        type="textarea"
        :placeholder="$t('insertFile.insert_SVGStr_placeholder')"
      />
    </Modal>
  </div>
</template>

<script name="ImportFile" setup>
import { getImgStr, selectFiles } from '@/utils/utils';
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';

const { fabric, canvasEditor } = useSelect();
const state = reactive({
  showModal: false,
  svgStr: '',
});
const HANDLEMAP = {
  // 插入图片
  insertImg: function () {
    selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          insertImgFile(file);
        });
      });
    });
  },
  // 插入Svg
  insertSvg: function () {
    selectFiles({ accept: '.svg', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          insertSvgFile(file);
        });
      });
    });
  },
  // 插入SVG元素
  insertSvgStrModal: function () {
    state.svgStr = '';
    state.showModal = true;
  },
  // 插入字符串元素
  insertSvgStr: function () {
    fabric.loadSVGFromString(state.svgStr, (objects, options) => {
      const item = fabric.util.groupSVGElements(objects, {
        ...options,
        name: 'defaultSVG',
        id: uuid(),
      });
      canvasEditor.canvas.add(item).centerObject(item).renderAll();
    });
  },
};

const insertTypeHand = (type) => {
  const cb = HANDLEMAP[type];
  cb && typeof cb === 'function' && cb();
};
// 插入图片文件
function insertImgFile(file) {
  if (!file) throw new Error('file is undefined');
  const imgEl = document.createElement('img');
  imgEl.src = file;
  // 插入页面
  document.body.appendChild(imgEl);
  imgEl.onload = () => {
    // 创建图片对象
    const imgInstance = new fabric.Image(imgEl, {
      id: uuid(),
      name: '图片1',
      left: 100,
      top: 100,
    });
    // 设置缩放
    canvasEditor.canvas.add(imgInstance);
    canvasEditor.canvas.setActiveObject(imgInstance);
    canvasEditor.canvas.renderAll();
    // 删除页面中的图片元素
    imgEl.remove();
  };
}

// 插入文件元素
function insertSvgFile(svgFile) {
  if (!svgFile) throw new Error('file is undefined');
  fabric.loadSVGFromURL(svgFile, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      name: 'defaultSVG',
      id: uuid(),
    });
    canvasEditor.canvas.add(item).centerObject(item).renderAll();
  });
}
</script>

<style scoped lang="less">
:deep(.ivu-select-dropdown) {
  z-index: 999;
}
</style>
