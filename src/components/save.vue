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
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
import { clipboardText } from '@/utils/utils.ts';
import { debounce } from 'lodash-es';
const { $this, $t } = useSelect();
const cbMap = {
  clipboard: function () {
    const jsonStr = this.canvas.editor.getJson();
    clipboardText(JSON.stringify(jsonStr, null, '\t'));
  },
  saveJson: function () {
    const dataUrl = this.canvas.editor.getJson();
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    downFile(fileStr, 'json');
  },
  saveSvg: function () {
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
    downFile(fileStr, 'svg');
  },
  saveImg: function () {
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
    downFile(dataUrl, 'png');
    this.canvas.editor.ruler.showGuideline();
  },
};
const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type].call($this);
}, 300);
/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  $this.canvas.c.getObjects().forEach((obj) => {
    if (obj.id !== 'workspace') {
      $this.canvas.c.remove(obj);
    }
  });
  $this.canvas.c.discardActiveObject();
  $this.canvas.c.renderAll();
};
const beforeClear = () => {
  Modal.confirm({
    title: $t('tip'),
    content: `<p>${$t('clearTip')}</p>`,
    okText: $t('ok'),
    cancelText: $t('cancel'),
    onOk: () => clear(),
  });
};
function downFile(fileStr, fileType) {
  const anchorEl = document.createElement('a');
  anchorEl.href = fileStr;
  anchorEl.download = `${uuid()}.${fileType}`;
  document.body.appendChild(anchorEl); // required for firefox
  anchorEl.click();
  anchorEl.remove();
}
</script>

<style scoped lang="less">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
</style>
