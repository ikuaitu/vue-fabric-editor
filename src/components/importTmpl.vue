<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-16 13:56:21
 * @Description: 导入模板
-->

<template>
  <div style="display: inline-block">
    <Divider plain orientation="left">{{ $t('title_template') }}</Divider>
    <Tooltip
      :content="item.label"
      v-for="(item, i) in state.list"
      :key="`${i}-bai1-button`"
      placement="top"
    >
      <img
        class="tmpl-img"
        :alt="item.label"
        v-lazy="item.src"
        @click="getTempData(item.tempUrl)"
      />
    </Tooltip>
  </div>
</template>

<script setup name="ImportTmpl">
import useSelect from '@/hooks/select';
// import { downFontByJSON } from '@/utils/utils';
import axios from 'axios';
import { Spin } from 'view-ui-plus';
import { useI18n } from 'vue-i18n';

const repoSrc = import.meta.env.APP_REPO;
const { t } = useI18n();
const { canvasEditor } = useSelect();
const state = reactive({
  jsonFile: null,
  list: [
    {
      label: '海报模板',
      tempUrl: `${repoSrc}template/49234261-0187-4fdc-be80-f9dfb14c8bc6.json`,
      src: `${repoSrc}template/49234261-0187-4fdc-be80-f9dfb14c8bc6.png`,
    },
    {
      label: '旅游海报',
      tempUrl: `${repoSrc}template/6ff9093a-4976-416b-8285-db5496842487.json`,
      src: `${repoSrc}template/6ff9093a-4976-416b-8285-db5496842487.png`,
    },
    {
      label: '邀请海报',
      tempUrl: `${repoSrc}template/b40fee28-de9f-4304-a07e-2f55d36f137e.json`,
      src: `${repoSrc}template/b40fee28-de9f-4304-a07e-2f55d36f137e.png`,
    },
  ],
});

// 插入文件
const insertSvgFile = () => {
  // state.jsonFile
  // console.log(state.jsonFile);
  canvasEditor.insertSvgFile(state.jsonFile);
  // Spin.show({
  //   render: (h) => h('div', t('alert.loading_fonts')),
  // });

  // downFontByJSON(state.jsonFile)
  //   .then(() => {
  //     Spin.hide();
  //     canvas.c.loadFromJSON(state.jsonFile, () => {
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
  //   })
  //   .catch(() => {
  //     Spin.hide();
  //     Message.error(t('alert.loading_fonts_failed'));
  //   });
};

// 获取模板列表数据
const getTempList = () => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  const getTemp = axios.get(`${repoSrc}template/index.json`);
  getTemp
    .then((res) => {
      state.list = res.data.data.map((item) => {
        item.tempUrl = repoSrc + item.tempUrl;
        item.src = repoSrc + item.src;
        return item;
      });
      Spin.hide();
    })
    .catch(Spin.hide);
};

// 获取模板数据
const getTempData = (tmplUrl) => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  const getTemp = axios.get(tmplUrl);
  getTemp.then((res) => {
    state.jsonFile = JSON.stringify(res.data);
    Spin.hide();
    insertSvgFile();
  });
};

getTempList();
</script>

<style scoped lang="less">
.tmpl-img {
  width: 94px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
