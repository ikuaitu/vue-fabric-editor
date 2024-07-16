<template>
  <div v-if="!mixinState.mSelectMode">
    <div class="attr-item-box">
      <!-- <h3>{{ $t('bgSeting.color') }}</h3> -->
      <Divider plain orientation="left">
        <h4>{{ $t('bgSeting.color') }}</h4>
      </Divider>
      <Form :label-width="0">
        <FormItem prop="name">
          <ColorPicker v-model="color" @on-change="setThisColor" alpha />
        </FormItem>
      </Form>
      <!-- <Divider plain></Divider> -->
    </div>
    <div class="attr-item-box">
      <!-- <h3>{{ $t('bgSeting.colorMacthing') }}</h3> -->
      <Divider plain orientation="left">
        <h4>{{ $t('bgSeting.colorMacthing') }}</h4>
      </Divider>
      <div class="color-list">
        <template v-for="(item, i) in colorList" :key="item + i">
          <span :style="`background:${item}`" @click="setColor(item)"></span>
        </template>
      </div>
    </div>

    <!-- <div>
      <Divider plain orientation="left">
        <h4>蒙版</h4>
      </Divider>

      <workspaceMask />
    </div> -->
  </div>
</template>

<script setup name="BgBar">
// import workspaceMask from './workspaceMask.vue';
import { ref } from 'vue';
import useSelect from '@/hooks/select';
const { mixinState, canvasEditor } = useSelect();

const colorList = ref([
  '#5F2B63',
  '#B23554',
  '#F27E56',
  '#FCE766',
  '#86DCCD',
  '#E7FDCB',
  '#FFDC84',
  '#F57677',
  '#5FC2C7',
  '#98DFE5',
  '#C2EFF3',
  '#DDFDFD',
  '#9EE9D3',
  '#2FC6C8',
  '#2D7A9D',
  '#48466d',
  '#61c0bf',
  '#bbded6',
  '#fae3d9',
  '#ffb6b9',
  '#ffaaa5',
  '#ffd3b6',
  '#dcedc1',
  '#a8e6cf',
]);

const color = ref('rgba(255, 255, 255, 1)');
// 背景颜色设置
const setThisColor = () => {
  setColor(color.value);
};
// 背景颜色设置
function setColor(c) {
  const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace');
  workspace.set('fill', c);
  canvasEditor.canvas.renderAll();
  color.value = c;
}

// 加载模板时回显颜色值
const handleChangeColor = () => {
  const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace');
  color.value = workspace.fill;
};

onMounted(() => {
  canvasEditor.on('loadJson', handleChangeColor);
});

onUnmounted(() => {
  canvasEditor.off('loadJson', handleChangeColor);
});
</script>

<style scoped lang="less">
:deep(.ivu-form-item) {
  margin-bottom: 0;
  .ivu-color-picker {
    display: unset;
  }
}
.color-list {
  display: flex;
  flex-wrap: wrap;
  span {
    height: 30px;
    width: 30px;
    border-radius: 15px;
    border: 3px solid #fff;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
