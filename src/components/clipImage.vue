<template>
  <div v-if="mixinState.mSelectMode === 'one' && type === 'image'" class="attr-item-box">
    <div class="bg-item ivu-mb-8">
      <Dropdown style="width: 270px" @on-click="addClipPath">
        <Button type="text" long>{{ $t('createClip') }}</Button>
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
      <Button @click="removeClip" type="text" long>{{ $t('removeClip') }}</Button>
    </div>
  </div>
</template>

<script setup name="ReplaceImg">
import useSelect from '@/hooks/select';
import { useI18n } from 'vue-i18n';

const update = getCurrentInstance();
// const canvasEditor = inject('canvasEditor');
const { mixinState, canvasEditor } = useSelect();
const { t } = useI18n();
const type = ref('');
const options = [
  {
    label: t('polygonClip'),
    value: 'polygon',
  },
  {
    label: t('rectClip'),
    value: 'rect',
  },
  {
    label: t('circleClip'),
    value: 'circle',
  },
  {
    label: t('triangleClip'),
    value: 'triangle',
  },
  {
    label: t('polygonClipInverted'),
    value: 'polygon-inverted',
  },
  {
    label: t('rectClipInverted'),
    value: 'rect-inverted',
  },
  {
    label: t('circleClipInverted'),
    value: 'circle-inverted',
  },
  {
    label: t('triangleClipInverted'),
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
