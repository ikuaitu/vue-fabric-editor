<!--
 * @Author: 秦少卫
 * @Date: 2024-06-12 16:48:10
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-12 21:51:40
 * @Description: 幻灯片
-->
<template>
  <div class="banner">
    <Carousel
      v-model="value"
      :height="250"
      :autoplay="setting.autoplay"
      :autoplay-speed="setting.autoplaySpeed"
      :dots="setting.dots"
      :radius-dot="setting.radiusDot"
      :trigger="setting.trigger"
      :arrow="setting.arrow"
    >
      <CarouselItem class="img-box" v-for="item in banners" :key="item.id">
        <a :href="item.url" target="_blank">
          <img :src="item.img" :alt="item.title" />
        </a>
      </CarouselItem>
    </Carousel>
  </div>
</template>
<script name="Banner" setup>
import { getBannerList } from '@/api/material';
import qs from 'qs';
const setting = reactive({
  autoplay: false,
  autoplaySpeed: 2000,
  dots: 'inside',
  radiusDot: false,
  trigger: 'click',
  arrow: 'hover',
});

import { getMaterialInfoUrl } from '@/hooks/usePageList';

const banners = ref([]);
getBannerList(
  qs.stringify({
    populate: {
      img: '*',
    },
  })
).then((res) => {
  banners.value = res.data.data.map((item) => {
    return {
      id: item.id,
      title: item.attributes.title,
      img: getMaterialInfoUrl(item.attributes.img),
      url: item.attributes.url,
    };
  });
});
</script>
<style lang="less" scoped>
.banner {
  width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
}
.img-box {
  overflow: hidden;
  height: 100%;
  img {
    height: 100%;
    margin: 0 auto;
    display: block;
  }
}
</style>
