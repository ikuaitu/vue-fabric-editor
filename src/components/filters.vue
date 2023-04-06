<!--
 * @Author: 秦少卫
 * @Date: 2023-04-06 23:04:38
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-07 00:30:07
 * @Description: 图片滤镜
-->

<template>
  <div v-if="mSelectMode === 'one' && type === 'image'" class="box attr-item">
    <Button type="text" long>图片滤镜</Button>
    <Select v-model="model" style="width: 200px" @on-change="applyFilter">
      <Option value="none">No filter</Option>
      <Option value="Invert">Invert</Option>
      <Option value="Sepia">Sepia</Option>
      <Option value="BlackWhite">Black & white</Option>
      <Option value="Brownie">Retro</Option>
      <Option value="Vintage">Vintage</Option>
      <Option value="Technicolor">Technicolor</Option>
      <Option value="Kodachrome">Kodachrome</Option>
      <Option value="Polaroid">Polaroid</Option>
    </Select>
  </div>
</template>

<script>
import select from '@/mixins/select';
const filters = [
  'BlackWhite',
  'Invert',
  'Sepia',
  'Kodachrome',
  'Polaroid',
  'Technicolor',
  'Brownie',
  'Vintage',
];
export default {
  name: 'replaceImg',
  mixins: [select],
  inject: ['canvas', 'fabric'],
  data() {
    return {
      id: '',
      model: 'none',
    };
  },
  created() {
    this.event.on('selectOne', () => {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject) {
        this.type = activeObject.type;
        if (this.type === 'image') {
          // 回显类型
          const imgFilter = activeObject.filters.find((item) => filters.includes(item.type));
          if (imgFilter) {
            this.model = imgFilter.type;
          } else {
            this.model = 'none';
          }
        }
        this.$forceUpdate();
      }
    });
  },
  methods: {
    // 应用滤镜
    applyFilter(name) {
      const f = this.fabric.Image.filters;
      var obj = this.canvas.c.getActiveObject();
      if (obj) {
        this.clearFilters(obj);
        if (name == 'Sepia') {
          obj.filters.push(new f.Sepia());
        } else if (name == 'Invert') {
          obj.filters.push(new f.Invert());
        } else if (name == 'BlackWhite') {
          obj.filters.push(new f.BlackWhite());
        } else if (name == 'Kodachrome') {
          obj.filters.push(new f.Kodachrome());
        } else if (name == 'Polaroid') {
          obj.filters.push(new f.Polaroid());
        } else if (name == 'Technicolor') {
          obj.filters.push(new f.Technicolor());
        } else if (name == 'Vintage') {
          obj.filters.push(new f.Vintage());
        } else if (name == 'Brownie') {
          obj.filters.push(new f.Brownie());
        }
        obj.applyFilters();
        this.canvas.c.renderAll();
      }
    },
    // 清空滤镜
    clearFilters(obj) {
      obj.filters = obj.filters.filter((item) => {
        return !filters.includes(item.type);
      });
      this.canvas.c.renderAll();
    },
  },
};
</script>

<style scoped lang="less"></style>
