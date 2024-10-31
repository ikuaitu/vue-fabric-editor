<!--
 * @Author: 秦少卫
 * @Date: 2024-05-17 15:30:21
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-09-05 13:22:47
 * @Description: file content
-->
<template>
  <div class="home">
    <Layout>
      <!-- 头部区域 -->
      <HomeHeader v-if="state.show" v-model:ruler="state.ruler" @ruler-switch="rulerSwitch" />

      <Content style="display: flex; height: calc(100vh - 64px)">
        <!-- 左侧区域 -->
        <HomeLeft v-if="state.show" v-model:toolsBarShow="state.toolsBarShow" />

        <!-- 画布区域 -->
        <div id="workspace">
          <div class="canvas-box">
            <div class="inside-shadow"></div>
            <canvas id="canvas" :class="state.ruler ? 'design-stage-grid' : ''"></canvas>
            <dragMode v-if="state.show"></dragMode>
            <zoom></zoom>
          </div>
        </div>

        <!-- 右侧区域 -->
        <HomeRight
          v-show="state.attrBarShow"
          v-model:attrBarShow="state.attrBarShow"
          v-model:show="state.show"
        />
      </Content>
    </Layout>
  </div>
</template>

<script name="Home" setup lang="ts">
// import fontTmpl from '@/components/fontTmpl.vue';

// 顶部组件
import HomeHeader from '@/components/homeHeader.vue';
// 左侧组件
import HomeLeft from '@/components/homeLeft.vue';
// 右侧组件
import HomeRight from '@/components/homeRight.vue';

import zoom from '@/components/zoom.vue';
import dragMode from '@/components/dragMode.vue';
// import elementData from '@/components/elementData.vue';

// 功能组件
import { fabric } from 'fabric';

// hooks
import useSelectListen from '@/hooks/useSelectListen';

const APIHOST = import.meta.env.APP_APIHOST;

import Editor, {
  IEditor,
  DringPlugin,
  AlignGuidLinePlugin,
  ControlsPlugin,
  // ControlsRotatePlugin,
  CenterAlignPlugin,
  LayerPlugin,
  CopyPlugin,
  MoveHotKeyPlugin,
  DeleteHotKeyPlugin,
  GroupPlugin,
  DrawLinePlugin,
  GroupTextEditorPlugin,
  GroupAlignPlugin,
  WorkspacePlugin,
  HistoryPlugin,
  FlipPlugin,
  RulerPlugin,
  MaterialPlugin,
  WaterMarkPlugin,
  FontPlugin,
  PolygonModifyPlugin,
  DrawPolygonPlugin,
  FreeDrawPlugin,
  PathTextPlugin,
  PsdPlugin,
  SimpleClipImagePlugin,
  BarCodePlugin,
  QrCodePlugin,
  ImageStroke,
  ResizePlugin,
  LockPlugin,
  AddBaseTypePlugin,
  MaskPlugin,
} from '@kuaitu/core';
import Edit from '@/components/edit.vue';
import ClipImage from '@/components/clipImage.vue';
import AttributeTextContent from '@/components/attributeTextContent.vue';

// 创建编辑器
const canvasEditor = new Editor() as IEditor;

const state = reactive({
  menuActive: 1,
  show: false,
  toolsBarShow: true,
  attrBarShow: true,
  select: null,
  ruler: true,
});

onMounted(() => {
  // 初始化fabric
  const canvas = new fabric.Canvas('canvas', {
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    // imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
    preserveObjectStacking: true, // 当选择画布中的对象时，让对象不在顶层。
  });

  // 初始化编辑器
  canvasEditor.init(canvas);
  canvasEditor
    .use(DringPlugin)
    .use(PolygonModifyPlugin)
    .use(AlignGuidLinePlugin)
    .use(ControlsPlugin)
    // .use(ControlsRotatePlugin)
    .use(CenterAlignPlugin)
    .use(LayerPlugin)
    .use(CopyPlugin)
    .use(MoveHotKeyPlugin)
    .use(DeleteHotKeyPlugin)
    .use(GroupPlugin)
    .use(DrawLinePlugin)
    .use(GroupTextEditorPlugin)
    .use(GroupAlignPlugin)
    .use(WorkspacePlugin)
    .use(HistoryPlugin)
    .use(FlipPlugin)
    .use(RulerPlugin)
    .use(DrawPolygonPlugin)
    .use(FreeDrawPlugin)
    .use(PathTextPlugin)
    .use(SimpleClipImagePlugin)
    .use(BarCodePlugin)
    .use(QrCodePlugin)
    .use(FontPlugin, {
      repoSrc: APIHOST,
    })
    .use(MaterialPlugin, {
      repoSrc: APIHOST,
    })
    .use(WaterMarkPlugin)
    .use(PsdPlugin)
    .use(ImageStroke)
    .use(ResizePlugin)
    .use(LockPlugin)
    .use(AddBaseTypePlugin)
    .use(MaskPlugin);

  state.show = true;
  // 默认打开标尺
  if (state.ruler) {
    canvasEditor.rulerEnable();
  }
});

onUnmounted(() => canvasEditor.destory());
const rulerSwitch = (val: boolean) => {
  if (val) {
    canvasEditor.rulerEnable();
  } else {
    canvasEditor.rulerDisable();
  }
  // 使标尺开关组件失焦，避免响应键盘的空格事件
  document.activeElement.blur();
};

const { mixinState } = useSelectListen(canvasEditor);

provide('fabric', fabric);
provide('canvasEditor', canvasEditor);
provide('mixinState', mixinState);
</script>
<style lang="less" scoped>
// 属性面板样式
:deep(.attr-item) {
  position: relative;
  margin-bottom: 12px;
  height: 40px;
  padding: 0 10px;
  background: #f6f7f9;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  .ivu-tooltip {
    text-align: center;
    flex: 1;
  }
}

.ivu-menu-vertical .menu-item {
  text-align: center;
  padding: 10px 2px;
  box-sizing: border-box;
  font-size: 12px;

  & > i {
    margin: 0;
  }
}

.home,
.ivu-layout {
  height: 100vh;
}

.icon {
  display: block;
}

.canvas-box {
  position: relative;
}
// 画布内阴影
.inside-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 9px 2px #0000001f;
  z-index: 2;
  pointer-events: none;
}

#canvas {
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

#workspace {
  flex: 1;
  width: 100%;
  position: relative;
  background: #f1f1f1;
  overflow: hidden;
}

.content {
  flex: 1;
  width: 220px;
  padding: 0 10px;
  height: 100%;
  overflow-y: auto;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: none;
}
// 标尺
.switch {
  margin-right: 10px;
}
// 网格背景
.design-stage-grid {
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 16px;
  --color: #dedcdc;
  background-image: linear-gradient(
      45deg,
      var(--color) 25%,
      transparent 0,
      transparent 75%,
      var(--color) 0
    ),
    linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-position: var(--offsetX) var(--offsetY),
    calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
</style>
