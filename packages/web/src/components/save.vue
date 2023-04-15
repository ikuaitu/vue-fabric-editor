<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-04-10 20:28:20
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-10 14:33:18

 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <Button style="margin-left: 10px" type="text" @click="clear">
      {{ $t('empty') }}
    </Button>
    <Dropdown style="margin-left: 10px" @on-click="saveWith">
      <Button type="primary">
        {{ $t('keep') }}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <template #list>
        <DropdownMenu>
          <DropdownItem name="clipboard">{{ $t('copy_to_clipboard') }}</DropdownItem>
          <DropdownItem name="saveImg">{{ $t('save_as_picture') }}</DropdownItem>
          <DropdownItem name="saveSvg">{{ $t('save_as_svg') }}</DropdownItem>
          <DropdownItem name="saveJson" divided>{{ $t('save_as_json') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
  </div>
</template>

<script>
import select from '@/mixins/select';
import { v4 as uuid } from 'uuid';

export default {
  name: 'saveBar',
  mixins: [select],
  data() {
    return {};
  },
  methods: {
    saveWith(type) {
      this[type]();
    },
    saveJson() {
      const dataUrl = this.canvas.editor.getJson();
      const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataUrl, null, '\t')
      )}`;
      this.downFile(fileStr, 'json');
    },
    saveSvg() {
      const workspace = this.canvas.c.getObjects().find((item) => item.id === 'workspace');
      const { left, top, width, height } = workspace;
      const dataUrl = this.canvas.c.toSVG({
        width,
        height,
        viewBox: {
          x: left,
          y: top,
          width,
          height,
        },
      });
      const fileStr = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataUrl)}`;
      this.downFile(fileStr, 'svg');
    },
    saveImg() {
      const workspace = this.canvas.c.getObjects().find((item) => item.id === 'workspace');
      this.canvas.editor.ruler.hideGuideline();
      const { left, top, width, height } = workspace;
      const option = {
        name: 'New Image',
        format: 'png',
        quality: 1,
        left,
        top,
        width,
        height,
      };
      this.canvas.c.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = this.canvas.c.toDataURL(option);
      this.downFile(dataUrl, 'png');
      this.canvas.editor.ruler.showGuideline();
    },
    downFile(fileStr, fileType) {
      const anchorEl = document.createElement('a');
      anchorEl.href = fileStr;
      anchorEl.download = `${uuid()}.${fileType}`;
      document.body.appendChild(anchorEl); // required for firefox
      anchorEl.click();
      anchorEl.remove();
    },
    clipboard() {
      const jsonStr = this.canvas.editor.getJson();
      this._mixinClipboard(JSON.stringify(jsonStr, null, '\t'));
    },
    clear() {
      this.canvas.c.getObjects().forEach((obj) => {
        if (obj.id !== 'workspace') {
          this.canvas.c.remove(obj);
        }
      });
      this.canvas.c.discardActiveObject();
      this.canvas.c.renderAll();
    },
  },
};
</script>

<style scoped lang="less">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
</style>
