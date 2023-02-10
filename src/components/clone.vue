<template>
  <Button v-if="mSelectMode === 'one'" @click="clone" icon="ios-copy" size="small"></Button>
</template>

<script>
import select from '@/mixins/select';

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
    };
  },
  methods: {
    clone() {
      this.canvas.editor.clone();
    },
  },
};
</script>

<style scoped lang="less">
</style>
