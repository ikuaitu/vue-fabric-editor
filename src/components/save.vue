<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-05-07 09:34:18
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-10 14:33:18

 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <Button style="margin-left: 10px" type="text" @click="beforeClear">
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

<script setup name="save-bar">
import { Modal } from 'view-ui-plus';
import { clipboardText } from '@/utils/utils.ts';
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { downloadFile } from '@/utils/utils';

const { t } = useI18n();

const { canvas } = useSelect();
const cbMap = {
  clipboard() {
    const jsonStr = canvas.editor.getJson();
    clipboardText(JSON.stringify(jsonStr, null, '\t'));
  },

  saveJson() {
    const dataUrl = canvas.editor.getJson();
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    downloadFile({
      file: fileStr,
      fileName: uuid(),
      fileExt: 'json',
    });
  },

  saveSvg() {
    const workspace = canvas.c.getObjects().find((item) => item.id === 'workspace');
    const { left, top, width, height } = workspace;
    const dataUrl = canvas.c.toSVG({
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
    downloadFile({
      file: fileStr,
      fileName: uuid(),
      fileExt: 'svg',
    });
  },

  saveImg() {
    const workspace = canvas.c.getObjects().find((item) => item.id === 'workspace');
    canvas.editor.ruler.hideGuideline();
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
    canvas.c.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.c.toDataURL(option);
    downloadFile({
      file: dataUrl,
      fileName: uuid(),
      fileExt: 'png',
    });
    canvas.editor.ruler.showGuideline();
  },
};

const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]();
}, 300);

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvas.c.getObjects().forEach((obj) => {
    if (obj.id !== 'workspace') {
      canvas.c.remove(obj);
    }
  });
  canvas.c.discardActiveObject();
  canvas.c.renderAll();
};

const beforeClear = () => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('clearTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => clear(),
  });
};
</script>

<style scoped lang="less">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
</style>
