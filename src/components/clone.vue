<template>
  <Tooltip v-if="isOne" :content="$t('quick.copy')">
    <Button long @click="clone" icon="ios-copy" type="text"></Button>
  </Tooltip>
</template>

<script setup name="Clone">
import useSelect from '@/hooks/select';
import { debounce } from 'lodash-es';

const { canvasEditor, isOne } = useSelect();
const clone = debounce(function () {
  canvasEditor.clone();
}, 300);
</script>
