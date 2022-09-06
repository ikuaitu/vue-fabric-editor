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
                <MenuItem :name="1" style="padding:10px"><Icon type="md-book" />模板</MenuItem>
                <MenuItem :name="2" style="padding:10px"><Icon type="md-create" />元素</MenuItem>
                <MenuItem :name="3" style="padding:10px"><Icon type="ios-build" />背景</MenuItem>
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
import hotkeys from '@/plugin/hotkeys'

import { fabric } from 'fabric';

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
      isLock: false,
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
      hotkeys(canvas.c)
      // 选中后的删除图标
      this.setRemoveIcon()
      this.setControlsStyle(fabric)
  },
  methods:{
    setRemoveIcon(){
      var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
      var img = document.createElement('img');
      img.src = deleteIcon;
      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -1,
        offsetY: 16,
        cursorStyle: 'pointer',
        mouseUpHandler: deleteObject,
        render: renderIcon,
        cornerSize: 24
      });

      function deleteObject(eventData, transform) {
        var target = transform.target;
        var canvas = target.canvas;
        canvas.remove(target);
        canvas.requestRenderAll();
      }

      function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
      }
    },
    setControlsStyle(fabric){
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerSize = 10;
      fabric.Object.prototype.cornerStrokeColor = '#C2C2C2';
      fabric.Object.prototype.cornerColor = '#ffffff';
      fabric.Object.prototype.cornerStyle = 'circle';
      fabric.Object.prototype.borderColor = '#85CCF9';
    }
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
