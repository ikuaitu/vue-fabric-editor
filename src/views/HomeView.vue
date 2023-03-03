<template>
  <div class="home">
    <Layout>
      <Header v-if="show">
        <Row :gutter="16">
          <Col>
            <importJSON />
          </Col>
          <Col >
            <importFile />
          </Col>
          <Col>
            <iSwitch v-model="ruler" size="large" class="switch">
              <span slot="open">{{ $t('grid') }}</span>
              <span slot="close">{{ $t('grid') }}</span>
             </iSwitch>
          </Col>
          <Col>
            <align></align>
          </Col>

          <Col>
            <flip></flip>
          </Col>


         
        </Row>
      </Header>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'
import importJSON from '@/components/importJSON.vue'
import importFile from '@/components/importFile.vue'
import align from '@/components/align.vue';
import flip from '@/components/flip.vue';
const show = ref(true)
const menuActive = ref(1)
const select = ref(null)
const ruler = ref(false)

onBeforeMount(() => {
  console.log('---挂载之前---')
})
onMounted(() => {
  console.log('---挂载---')
})
onBeforeUpdate(() => {
  console.log('---更新之前---')
})
onUpdated(() => {
  console.log('---更新---')
})
onBeforeUnmount(() => {
  console.log('---卸载之前---')
})
onUnmounted(() => {
  console.log('---卸载---')
})
</script>
