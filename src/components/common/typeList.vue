<!--
 * @Author: 秦少卫
 * @Date: 2024-06-11 16:17:17
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-12 15:43:54
 * @Description: 列表组件
-->

<template>
  <div class="material-type">
    <div class="item" v-for="item in materialTypeList" :key="item.id">
      <div class="top">
        <h3>{{ item.name }}</h3>
        <Button type="text" size="small" @click="emit('selectType', item.id)">查看更多</Button>
      </div>
      <div class="img-box">
        <div class="img-item" v-for="info in item.list" :key="info.id">
          <Image
            lazy
            :src="info.src"
            @click="(e) => emit('click', { info, e })"
            @dragend="(e) => emit('dragend', { info, e })"
            fit="contain"
            width="100%"
            height="100%"
            :alt="info.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script name="ImportJson" setup>
const baseURL = import.meta.env.APP_APIHOST;

const emit = defineEmits(['click', 'dragend']);

const props = defineProps({
  typeApi: {
    type: Function,
  },
  typeListApi: {
    type: Function,
  },
  typeKey: {
    type: String,
  },
  formatData: {
    type: Function,
  },
});

// 素材分类
const materialTypeList = ref([]);
const getMaterialTypesHandler = async () => {
  const res = await props.typeApi();
  materialTypeList.value = res.data.data.map((item) => {
    return {
      name: item.attributes.name,
      id: item.id,
      list: [],
    };
  });
};

const getMaterialsByTypeHandler = async () => {
  materialTypeList;
  let i = 0;
  for (const item of materialTypeList.value) {
    const res = await props.typeListApi({
      populate: {
        img: '*',
      },
      filters: {
        [props.typeKey]: {
          $eq: item.id,
        },
      },
      pagination: {
        page: 1,
        pageSize: 8,
      },
    });
    materialTypeList.value[i].list = props.formatData(res.data.data);

    i++;
  }
};

onMounted(async () => {
  await getMaterialTypesHandler();
  await getMaterialsByTypeHandler();
});
</script>
<style scoped lang="less">
.item {
  .top {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
  }
}

.img-box {
  background: #f1f2f4;
  display: grid;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(4, 60px);
  grid-template-rows: repeat(2, 70px);
  grid-row-gap: 10px;
  justify-content: space-between;
  padding: 8px;
  background: #f1f2f4;
  border-radius: 10px;
  margin-bottom: 10px;
  .img-item {
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    &:hover {
      background: #bababa;
    }
  }
}
</style>
