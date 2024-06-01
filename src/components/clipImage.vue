<template>
  <div v-if="mixinState.mSelectMode === 'one' && type === 'image'" class="attr-item-box">
    <div class="bg-item ivu-mb-8">
      <Dropdown style="width: 270px" @on-click="addClipPath">
        <Button type="text" long>添加裁切</Button>
        <template #list>
          <DropdownMenu>
            <DropdownItem v-for="item in options" :key="item.value" :name="item.value">
              {{ item.label }}
            </DropdownItem>
          </DropdownMenu>
        </template>
      </Dropdown>
    </div>
    <div class="bg-item">
      <Button @click="removeClip" type="text" long>移除裁切</Button>
    </div>
  </div>
</template>

<script setup name="ReplaceImg">
import useSelect from '@/hooks/select';
import { fabric } from 'fabric';

import { getPolygonVertices } from '@/utils/math';

const update = getCurrentInstance();
// const canvasEditor = inject('canvasEditor');
const { mixinState, canvasEditor } = useSelect();
const type = ref('');
const options = [
  {
    label: '多边形',
    value: 'polygon',
  },
  {
    label: '矩形',
    value: 'rect',
  },
  {
    label: '圆',
    value: 'circle',
  },
  {
    label: '三角形',
    value: 'triangle',
  },
  {
    label: '多边形【反】',
    value: 'polygon-inverted',
  },
  {
    label: '矩形【反】',
    value: 'rect-inverted',
  },
  {
    label: '圆【反】',
    value: 'circle-inverted',
  },
  {
    label: '三角形【反】',
    value: 'triangle-inverted',
  },
];
const addClipPath = async (name) => {
  canvasEditor.addClipPathToImage(name);
};
const removeClip = () => {
  canvasEditor.removeClip();
};
const init = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    type.value = activeObject.type;
    update?.proxy?.$forceUpdate();
  }
};

onMounted(() => {
  canvasEditor.on('selectOne', init);
});

onBeforeUnmount(() => {
  canvasEditor.off('selectOne', init);
});
</script>
<style lang="less" scoped>
.attr-item-box {
  margin-top: 8px;
}
</style>
