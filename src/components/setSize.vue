<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-03 08:59:06
 * @Description: 尺寸设置
-->

<template>
  <div>
    <Divider plain orientation="left">{{ $t('size') }}</Divider>
    <Form :label-width="40">
      <FormItem :label="$t('width')" prop="name">
          <InputNumber :max="2000" :min="1" v-model="width" @on-change="setSize" size="small"></InputNumber>
      </FormItem>
      <FormItem :label="$t('height')" prop="name">
          <InputNumber :max="2000" :min="1" v-model="height" @on-change="setSize" size="small"></InputNumber>
      </FormItem>
    </Form>
    <Button @click="rSet">1:1</Button>
    <Divider plain orientation="left">{{ $t('default_size') }}</Divider>
    <ButtonGroup vertical>
      <Button
        v-for="(item, i) in presetSize"
        :key="i + 'presetSize'"
        size="small"
        style="text-align:left"
        @click="setSizeBy(item.width * item.scale, item.height * item.scale)"
        >
        {{ item.label }}:{{ item.width }}x{{ item.height }}*{{ item.scale }}
      </Button>
    </ButtonGroup>
  </div>
</template>

<script>
export default {
  name: 'canvasSize',
  inject: ['canvas', 'fabric'],
  data() {
    return {
      width: 900,
      height: 1200,
      presetSize: [{
        label: this.$t('red_book_vertical'),
        width: 900,
        height: 1200,
        scale: 1,
      },
      {
        label: this.$t('red_book_horizontal'),
        width: 1200,
        height: 900,
        scale: 1,
      },
      {
        label: this.$t('phone_wallpaper'),
        width: 1080,
        height: 1920,
        scale: 1,
      },
      ]
    };
  },
  mounted() {
    this.initWorkspace()
    // this.setSize()
  },
  methods: {
    rSet(){
      const scale = 0.3
      // const scale = this.getScale()
      alert(scale)
      const workspace = document.querySelector('#workspace')
      let width = workspace.offsetWidth, height = workspace.offsetHeight
      
      if(this.width * scale > workspace.offsetWidth){
        width = this.width * scale
        alert(1)
      }

      if(this.height * scale > workspace.offsetHeight){
        height = this.height * scale
        alert(2)
      }
      const Point = this.canvas.c.getVpCenter()
      console.log(this.canvas.c.getVpCenter())
      this.canvas.c.zoomToPoint(
        // Point,
        // new this.fabric.Point(workspace.offsetWidth/2,  0),
        new this.fabric.Point(workspace.offsetWidth - this.width * scale,  workspace.offsetWidth - this.height * scale),
        // new this.fabric.Point(0,  0),
			  scale
      )
      this.canvas.c.setWidth(width);
      this.canvas.c.setHeight(height);
      this.canvas.c.renderAll()
    },
    initWorkspace(){
      this.canvas.c.setBackgroundColor('#F1F1F1', this.canvas.c.renderAll.bind(this.canvas.c))
      this.canvas.c.backgroundImage = ''
      // const workspace = document.querySelector('#workspace')
      this.canvas.c.setWidth(this.width);
      this.canvas.c.setHeight(this.height);
      // const resizeObserver = new ResizeObserver((entries) => {
      //   const { width, height } = entries[0].contentRect
      //   const oldWidth = this.canvas.c.width
      //   const oldHeight = this.canvas.c.height
      //   const diffWidth = width / 2 - oldWidth / 2;
		  //   const diffHeight = height / 2 - oldHeight / 2;
      //   this.canvas.c.setWidth(width);
      //   this.canvas.c.setHeight(height);
      //   const workspaceObj = this.canvas.c.getObjects().find(item => item.id === 'workspace')
      //   if(workspaceObj){
      //     workspaceObj.center()
      //     this.setViewport()
      //   }
      //   this.canvas.c.getObjects().forEach((obj) => {
			// 	if (obj.id !== 'workspace') {
			// 		const left = obj.left + diffWidth;
			// 		const top = obj.top + diffHeight;
			// 		obj.set({
			// 			left,
			// 			top,
			// 		});
			// 		obj.setCoords();
			// 	}
			// });
      //   this.canvas.c.renderAll()
      // });
      // resizeObserver.observe(workspace);

      const rectBg = new this.fabric.Rect({
        fill: '#ffffff',
        width: this.width,
        height: this.height,
        id: 'workspace',
      });
      rectBg.set('selectable',false)
      rectBg.set('hasControls',false)
      // rectBg.set('shadow', new fabric.Shadow({
      //   color: 'rgba(0,0,0,0.53)',
      //   blur: (this.width * this.height) / 10000 * 2,
      //   offsetX: 0,
      //   offsetY: 0,
      // }))
      this.canvas.c.add(rectBg)
      rectBg.center()
      // this.setViewport()
      this.canvas.c.renderAll()
    },
    setViewport(){
      const scale = this.getScale()
      this.canvas.c.zoomToPoint({
        x:this.canvas.c.width/2,
        y:this.canvas.c.height/2
      },scale - 0.05)
      this.canvas.c.renderAll()
    },
    setSizeBy(width, height) {
      const workspace = this.canvas.c.getObjects().find(item => item.id === 'workspace')
      workspace.set('width', width);
      workspace.set('height', height);
      workspace.center()
      this.canvas.c.renderAll()
      this.width = width
      this.height = height
    },
    getScale(){
        // const workspace = this.canvas.c.getObjects().find(item => item.id === 'workspace')
        const workspace = document.querySelector('#workspace')
        const viewPortWidth = workspace.offsetWidth
        const viewPortHeight = workspace.offsetHeight
        if (viewPortWidth/viewPortHeight < this.width/this.height) {
            return viewPortWidth / this.width
        }else{ // 按照宽度缩放
            return viewPortHeight / this.height
        }
    },
    setSize() {
      const workspace = this.canvas.c.getObjects().find(item => item.id === 'workspace')
      workspace.set('width', this.width);
      workspace.set('height', this.height);
      workspace.center()
      this.canvas.c.renderAll()
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .ivu-form-item {
    margin-bottom: 0;
}
/deep/ .ivu-divider-plain.ivu-divider-with-text-left{
  margin: 10px 0;
  font-weight: bold;
}
</style>
