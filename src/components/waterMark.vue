<!--
 * @Author: June
 * @Description:
 * @Date: 2023-11-01 11:54:10
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-22 00:51:43
-->
<template>
  <Button type="text" @click="addWaterMark">
    {{ $t('waterMark.text') }}
  </Button>

  <Modal v-model="showWaterMadal" :title="$t('waterMark.modalTitle')">
    <div class="setting-item required">
      <span class="mr-10px">{{ $t('waterMark.setting.name') }}</span>
      <Input
        class="w-320"
        v-model="waterMarkState.text"
        maxlength="15"
        show-word-limit
        :placeholder="$t('placeholder')"
      />
    </div>
    <div class="setting-item font-selector">
      <span class="mr-10px">选择字体</span>
      <Select class="w-320" v-model="waterMarkState.fontFamily" @on-change="changeFontFamily">
        <Option v-for="item in fontsList" :value="item.name" :key="`font-${item.name}`">
          <div class="font-item" v-if="!item.img">{{ item.name }}</div>
          <div class="font-item" v-else :style="`background-image:url('${item.img}');`">
            {{ !item.img ? item : '' }}
            <!-- 解决无法选中问题 -->
            <span style="display: none">{{ item.name }}</span>
          </div>
        </Option>
      </Select>
    </div>
    <div class="setting-item">
      <span class="mr-10px">{{ $t('waterMark.setting.size') }}</span>

      <Slider class="w-320" v-model="waterMarkState.size" :min="18" :max="48"></Slider>
    </div>
    <div class="setting-item">
      <span class="mr-10px">{{ $t('waterMark.setting.color') }}</span>

      <ColorPicker v-model="waterMarkState.color" alpha size="small" />
    </div>
    <div class="setting-item">
      <span class="mr-10px">{{ $t('waterMark.setting.position.label') }}</span>

      <RadioGroup v-model="waterMarkState.position">
        <Radio :label="POSITION.lt">{{ $t('waterMark.setting.position.lt') }}</Radio>
        <Radio :label="POSITION.rt">{{ $t('waterMark.setting.position.rt') }}</Radio>
        <Radio :label="POSITION.lb">{{ $t('waterMark.setting.position.lb') }}</Radio>
        <Radio :label="POSITION.rb">{{ $t('waterMark.setting.position.rb') }}</Radio>
        <Radio :label="POSITION.full">{{ $t('waterMark.setting.position.full') }}</Radio>
      </RadioGroup>
    </div>
    <div class="setting-item" v-show="waterMarkState.position === POSITION.full">
      <span class="mr-10px">{{ $t('waterMark.setting.angle') }}</span>

      <div>
        <RadioGroup v-model="waterMarkState.isRotate">
          <Radio :label="0">横向</Radio>
          <Radio :label="1">倾斜</Radio>
        </RadioGroup>
      </div>
    </div>
    <template #footer>
      <Button type="text" @click="onCleanUpWaterMark">
        {{ `${$t('cleanUp')}${$t('waterMark.text')}` }}
      </Button>
      <Button type="primary" @click="onModalOk">确定</Button>
    </template>
  </Modal>
</template>

<script name="WaterMark" lang="ts" setup>
import { cloneDeep, debounce } from 'lodash-es';
import useSelect from '@/hooks/select';
// import { useFont } from '@/hooks';
import { Message } from 'view-ui-plus';
enum POSITION {
  lt = 'Left_Top',
  lb = 'Left_Right',
  rt = 'Right_Top',
  rb = 'Right_Bottom',
  full = 'Full',
}

type IPosition = POSITION.lt | POSITION.lb | POSITION.rt | POSITION.rb | POSITION.full; // lt 左上 lr 左上 rt 右上  rb 右下 full 平铺 后续可扩展其他功能

type IDrawOps = {
  text: string;
  size: number;
  fontFamily: string;
  color: string;
  isRotate: boolean;
  position: IPosition;
};
const { canvasEditor }: any = useSelect();

const fontsList: any = ref([]);
canvasEditor.getFontList().then((list: any) => {
  fontsList.value = list;
});
const waterMarkState: any = reactive({
  text: '',
  size: 24,
  isRotate: 0, // 组件不支持boolean
  fontFamily: '汉体', // 可考虑自定义字体
  color: '#ccc', // 可考虑自定义颜色
  position: POSITION.lt, // lt 左上 rt 右上 lb 左下  rb 右下 full 平铺
});

const showWaterMadal = ref(false);

const onCleanUpWaterMark = () => {
  waterMarkState.text = '';
  waterMarkState.size = 24;
  waterMarkState.fontFamily = 'serif';
  waterMarkState.color = '#ccc';
  waterMarkState.position = POSITION.lt;
  waterMarkState.isRotate = 0;
  canvasEditor.clearWaterMMatk();
  showWaterMadal.value = false;
};

const onModalOk = async () => {
  if (!waterMarkState.text) return Message.warning('水印名字不能为空');
  const ops: IDrawOps = cloneDeep(waterMarkState);
  ops.isRotate = !!ops.isRotate; // 转为对应类型  后续再统一处理类型
  await canvasEditor.drawWaterMark(ops);
  showWaterMadal.value = false;
  // onMadalCancel();
};

const changeFontFamily = (fontName: string) => {
  if (!fontName) return;
  canvasEditor.loadFont(fontName);
};

const addWaterMark = debounce(function () {
  showWaterMadal.value = true;
}, 250);
</script>

<style lang="less" scoped>
.mr-10px {
  margin-right: 10px;
}
.w-320 {
  width: 320px;
}
.setting-item {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  &.required::before {
    content: '*';
    color: red;
    position: absolute;
    top: 3px;
    left: -6px;
  }
}
.font-selector {
  :deep(.ivu-select-item) {
    padding: 1px 4px;
  }

  .font-item {
    height: 40px;
    width: 330px;
    background-size: auto 40px;
    background-repeat: no-repeat;
  }
}
</style>
