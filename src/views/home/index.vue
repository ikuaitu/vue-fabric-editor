<template>
  <div class="home">
    <Layout>
      <Header v-if="show">
        <!-- 导入 -->
        <import-JSON></import-JSON>
        &nbsp;
        <import-file></import-file>
        &nbsp;
        <!-- 对齐方式 -->
        <align></align>
        &nbsp;
        <flip></flip>
        &nbsp;
        <center-align></center-align>
        &nbsp;
        <group></group>
        &nbsp;
        <lock></lock>
        &nbsp;
        <dele></dele>
        &nbsp;
        <clone></clone>

        <div style="float: right">
          <save></save>
          <lang></lang>
        </div>
      </Header>
      <Content style="display: flex; height: calc(100vh - 64px)">
        <div v-if="show" style="width: 380px; height: 100%; background: #fff; display: flex">
          <Menu :active-name="menuActive" accordion @on-select="(activeIndex) => (menuActive = activeIndex)"
            width="65px">
            <MenuItem :name="1" class="menu-item">
            <Icon type="md-book" size="24" />
            <div>{{ $t("templates") }}</div>
            </MenuItem>
            <MenuItem :name="2" class="menu-item">
            <Icon type="md-images" size="24" />

            <div>{{ $t("elements") }}</div>
            </MenuItem>
            <MenuItem :name="3" class="menu-item">
            <Icon type="md-paper-plane" size="24" />

            <div>{{ $t("background") }}</div>
            </MenuItem>
          </Menu>
          <div class="content">
            <!-- 生成模板 -->
            <div v-show="menuActive === 1" class="left-panel">
              <import-tmpl></import-tmpl>
            </div>
            <!-- 常用元素 -->
            <div v-show="menuActive === 2" class="left-panel">
              <tools></tools>
              <svgEl></svgEl>
            </div>
            <!-- 背景设置 -->
            <div v-show="menuActive === 3" class="left-panel">
              <set-size></set-size>
              <bg-bar></bg-bar>
            </div>
          </div>
        </div>
        <!-- 画布区域 -->
        <div id="workspace" style="width: 100%; position: relative; background: #f1f1f1">
          <div class="canvas-box">
            <div class="inside-shadow"></div>
            <canvas id="canvas"></canvas>
            <zoom></zoom>
            <mouseMenu></mouseMenu>
          </div>
        </div>
        <!-- 属性区域 -->
        <div style="
            width: 380px;
            height: 100%;
            padding: 10px;
            overflow-y: auto;
            background: #fff;
          ">
          <history v-if="show"></history>
          <attribute v-if="show"></attribute>
          <layer v-if="show"></layer>
        </div>
      </Content>
    </Layout>
  </div>
</template>

<script>

// 导入元素
import importJSON from '@/components/importJSON.vue';
import importFile from '@/components/importFile.vue';

// 顶部组件
import align from '@/components/align.vue';
import centerAlign from '@/components/centerAlign.vue';
import flip from '@/components/flip.vue';
import save from '@/components/save.vue';
import lang from '@/components/lang.vue';
import clone from '@/components/clone.vue';
import group from '@/components/group.vue';
import zoom from '@/components/zoom.vue';
import lock from '@/components/lock.vue';
import dele from '@/components/del.vue';

// 左侧组件
import importTmpl from '@/components/importTmpl.vue';
import tools from '@/components/tools.vue';
import svgEl from '@/components/svgEl.vue';
import bgBar from '@/components/bgBar.vue';
import setSize from '@/components/setSize.vue';

// 右侧组件
import history from '@/components/history.vue';
import layer from '@/components/layer.vue';
import attribute from '@/components/attribute.vue';

// 右键菜单
import mouseMenu from '@/components/mouseMenu.vue';

// 功能组件
import EventHandle from '@/utils/eventHandler';

import { fabric } from 'fabric';
import Editor from '@/core';

const event = new EventHandle();
const canvas = {};
export default {
  name: 'HomeView',
  provide: {
    canvas,
    fabric,
    event,
  },
  data() {
    return {
      menuActive: 1,
      show: false,
      select: null,
    };
  },
  components: {
    setSize, tools, bgBar, lock, layer, align, attribute, dele, importFile, save, lang, importJSON, clone, flip, importTmpl, centerAlign, group, zoom, svgEl, history, mouseMenu,
  },
  created() {
    this.$Spin.show();
  },
  mounted() {
    this.canvas = new fabric.Canvas('canvas', {
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    });

    canvas.c = this.canvas;
    event.init(canvas.c);
    canvas.editor = new Editor(canvas.c);
    this.show = true;
    this.$Spin.hide();
  },
};
</script>
<style lang="less" scoped>
.ivu-menu-vertical .menu-item {
  text-align: center;
  padding: 10px 2px;
  box-sizing: border-box;
  font-size: 12px;

  &>i {
    margin: 0;
  }
}

/deep/ .ivu-layout-header {
  padding: 0 10px;
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

.inside-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: inset 15px 5px blue;
  box-shadow: inset 0 0 9px 2px #0000001f;
  z-index: 2;
  pointer-events: none;
}

#canvas {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  // background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJglEDhoUBg9+FowbQ2gAARjwKARjtnN8AAAAASUVORK5CYII=");
  background-size: 30px 30px;
}

#workspace {
  overflow: hidden;
}

.content {
  flex: 1;
  width: 220px;
  padding: 10px;
  padding-top: 0;
  height: 100%;
  overflow-y: auto;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: none;
}
</style>
