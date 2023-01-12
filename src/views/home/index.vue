<template>
  <div class="home">
     <Layout >
        <Header v-if="show">
          <!-- 导入 -->
          <import-JSON></import-JSON>
          &nbsp;
          <import-svg></import-svg>
          &nbsp;
          <import-img></import-img>
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
          <zoom></zoom>
          &nbsp;
          <lock></lock>
          &nbsp;
          <dele></dele>
          &nbsp;
          <clone></clone>

          <div style="float:right">
              <save></save>
          </div>
        </Header>
        <Content style=" display: flex; height: calc(100vh - 64px);">
          <div v-if="show" style="width: 380px; height: 100%; background:#fff; display: flex">
              <Menu :active-name="menuActive" accordion @on-select="activeIndex => menuActive = activeIndex" width="80px">
                <MenuItem :name="1" style="padding:10px"><Icon type="md-book" />{{ $t('templates') }}</MenuItem>
                <MenuItem :name="2" style="padding:10px"><Icon type="md-create" />{{ $t('elements') }}</MenuItem>
                <MenuItem :name="3" style="padding:10px"><Icon type="ios-build" />{{ $t('background') }}</MenuItem>
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
          <div style="width: 100%;position: relative; background:#F1F1F1;">
            <div class="canvas-box">
              <canvas id="canvas"></canvas>
            </div>
          </div>
          <!-- 属性区域 -->
          <div style="width: 380px; height: 100%; padding:10px; overflow-y: auto; background:#fff">
            <history v-if="show"></history>
            <layer v-if="show"></layer>
            <attribute v-if="show"></attribute>
          </div>
        </Content>
    </Layout>
  </div>
</template>

<script>

// 导入元素
import importJSON from '@/components/importJSON.vue'
import importSvg from '@/components/importSvg.vue'
import importImg from '@/components/importImg.vue'

// 顶部组件
import align from '@/components/align.vue'
import centerAlign from '@/components/centerAlign.vue'
import flip from '@/components/flip.vue'
import save from '@/components/save.vue'
import clone from '@/components/clone.vue'
import group from '@/components/group.vue'
import zoom from '@/components/zoom.vue'
import lock from '@/components/lock.vue'
import dele from '@/components/del.vue'

// 左侧组件
import importTmpl from '@/components/importTmpl.vue'
import tools from '@/components/tools.vue'
import svgEl from '@/components/svgEl.vue'
import bgBar from '@/components/bgBar.vue'
import setSize from '@/components/setSize.vue'

// 右侧组件
import history from '@/components/history.vue'
import layer from '@/components/layer.vue'
import attribute from '@/components/attribute.vue'

// 功能组件
import EventHandle from '@/utils/eventHandler'

import { fabric } from 'fabric';

// 对齐辅助线
import initAligningGuidelines from '@/core/initAligningGuidelines';
import initHotkeys from '@/core/initHotKeys';
import initControls from '@/core/initControls';


const event = new EventHandle()
const canvas = {}
export default {
  name: 'HomeView',
  provide: {
    canvas,
    fabric,
    event
  },
  data() {
    return {
      menuActive: 1,
      show: false,
      select: null,
    };
  },
  components: {
    setSize,tools,bgBar,lock,layer, align, attribute, dele,importSvg,save,importJSON,clone,flip,importImg, importTmpl, centerAlign, group, zoom,svgEl,history
  },
  created(){
     this.$Spin.show();
  },
  mounted() {
      this.canvas = canvas.c = new fabric.Canvas('canvas');
      this.canvas.set('backgroundColor', '#fff')
      this.show = true
      this.$Spin.hide();
      event.init(canvas.c)
      initAligningGuidelines(canvas.c)
      initHotkeys(canvas.c)
      initControls(canvas.c)
  }
};
</script>
<style lang="less" scoped>

/deep/ .ivu-layout-header {
    padding: 0 10px;
}
.home,.ivu-layout{
  height: 100vh;
}
.icon{
   display: block;
}
.canvas-box{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#canvas{
  width: 300px;
  height: 300px;
  margin: 0 auto;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJglEDhoUBg9+FowbQ2gAARjwKARjtnN8AAAAASUVORK5CYII=");
  background-size: 30px 30px;
}
.content{
  flex: 1;
  width: 200px;
  padding:10px;
  padding-top: 0;
  height: 100%;
  overflow-y: auto;
}
</style>
