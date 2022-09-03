<template>
  <Button v-if="mSelectMode === 'one'" @click="clone" icon="ios-copy" size="small"></Button>
</template>

<script>
import select from '@/mixins/select'
import { v4 as uuid } from 'uuid';

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
    };
  },
  methods:{
    clone(){
      const activeObject = this.canvas.c.getActiveObject();
      activeObject.clone(cloned => {
        this.canvas.c.discardActiveObject()
        // 间距设置
        const grid = 10
        cloned.set({
          left: cloned.left + grid,
          top: cloned.top + grid,
          id: uuid()
        })
        this.canvas.c.add(cloned)
        this.canvas.c.setActiveObject(cloned);
        this.canvas.c.requestRenderAll();
      })
    },
  }
};
</script>

<style scoped lang="less">
</style>
