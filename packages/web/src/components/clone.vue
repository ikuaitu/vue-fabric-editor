<template>
  <Tooltip v-if="mSelectMode === 'one'" :content="$t('quick.copy')">
    <Button @click="clone" icon="ios-copy" type="text"></Button>
  </Tooltip>
</template>

<script>
import select from '@/mixins/select';

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {};
  },
  methods: {
    clone() {
      this.canvas.editor.clone();
    },
  },
};
</script>

<style scoped lang="less"></style>
