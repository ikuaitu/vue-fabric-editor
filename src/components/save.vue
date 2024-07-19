<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 15:49:01
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-10 14:33:18
 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <Button style="margin-left: 10px" type="text" @click="beforeClear">
      {{ $t('save.empty') }}
    </Button>
    <Dropdown style="margin-left: 10px" @on-click="saveWith">
      <Button type="primary">
        {{ $t('save.down') }}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <template #list>
        <DropdownMenu>
          <DropdownItem name="saveMyClould">{{ $t('save.save_my_spase') }}</DropdownItem>
          <DropdownItem name="saveImg" divided>{{ $t('save.save_as_picture') }}</DropdownItem>
          <DropdownItem name="saveSvg">{{ $t('save.save_as_svg') }}</DropdownItem>
          <DropdownItem name="clipboard" divided>{{ $t('save.copy_to_clipboard') }}</DropdownItem>
          <DropdownItem name="clipboardBase64">{{ $t('save.copy_to_clipboardstr') }}</DropdownItem>
          <DropdownItem name="saveJson" divided>{{ $t('save.save_as_json') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
  </div>
</template>

<script setup name="save-bar">
import { Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';
import useMaterial from '@/hooks/useMaterial';
import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { Spin } from 'view-ui-plus';
import { useRoute } from 'vue-router';
import { Message } from 'view-ui-plus';
const route = useRoute();

const { createTmplByCommon, updataTemplInfo, routerToId } = useMaterial();

const { t } = useI18n();

const { canvasEditor } = useSelect();
const cbMap = {
  async clipboard() {
    try {
      await canvasEditor.clipboard();
      Message.success('复制成功');
    } catch (error) {
      Message.error('复制失败');
    }
  },
  saveJson() {
    canvasEditor.saveJson();
  },
  saveSvg() {
    canvasEditor.saveSvg();
  },
  saveImg() {
    canvasEditor.saveImg();
  },
  async clipboardBase64() {
    try {
      await canvasEditor.clipboardBase64();
      Message.success('复制成功');
    } catch (error) {
      Message.error('复制失败');
    }
  },
  async saveMyClould() {
    try {
      Spin.show();
      if (route?.query?.id) {
        await updataTemplInfo(route?.query?.id);
      } else {
        const res = await createTmplByCommon();
        routerToId(res.data.data.id);
      }
    } catch (error) {
      Message.warning('请登录');
    }
    Spin.hide();
  },
};

const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]();
}, 300);

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvasEditor.clear();
  canvasEditor.canvas.clearHistory(false);
  canvasEditor.historyUpdate();
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
