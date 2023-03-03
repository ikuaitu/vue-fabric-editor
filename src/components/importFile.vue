<template>
  <div class="import_file">
    <Dropdown transfer-class-name="fix" @on-click="insertTypeHand">
      <Button size="small">
        {{ $t('insert') }}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <template #list>
        <DropdownMenu>
          <DropdownItem name="insertImg">{{ $t('insert_picture') }}</DropdownItem>
          <DropdownItem name="insert">{{ $t('select_image') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
    <!-- 插入图片 -->
    <Modal :title="$t('please_choose')" @on-ok="" @on-cancel="">
      <Upload action="#">
        <Button icon="ios-cloud-upload-outline">{{ $t('insert_picture') }}</Button>
      </Upload>
    </Modal>
    <!--  插入SVG -->
    <Modal :title="$t('please_choose')" v-model="showImgModal" @on-ok="insertImgFile">
      <RadioGroup
        v-model="insertType"
        type="button"
        button-style="solid"
        style="padding-bottom: 10px"
      >
        <Radio label="string">{{ $t('string') }}</Radio>
        <Radio label="file">{{ $t('file') }}</Radio>
      </RadioGroup>
      <!-- 字符串 -->
      <Input show-word-limit type="textarea" placeholder="请输入SVG字符" />
      <!-- 文件 -->
      <Upload v-if="insertType === 'file'" :before-upload="handleUpload" action="#">
        <Button icon="ios-cloud-upload-outline">{{ $t('select_svg') }}</Button>
      </Upload>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { getImgStr } from '@/utils/utils'
import { v4 as uuid } from 'uuid'

const showImgModal = ref(false)
const imgFile: Ref<string | ArrayBuffer | null> = ref(null)
const insertType = ref('')
const showModal = ref(false)
const svgStr = ref('')
const svgFile = ref(null)
const insertTypeHand = (type: string) => {
  console.log(type)
  switch (type) {
    case 'insertImg':
      insertImg()
      break
    case 'insert':
      insert()
      break
  }
}
const handleUpload = (file: Blob) => {
  getImgStr(file).then((res) => {
    imgFile.value = res
  })
}
const insertImgFile = () => {
  const imgDom:HTMLImageElement = document.createElement('img')
  imgDom.src = imgFile.value
  // 插入页面
  document.body.appendChild(imgDom)
  imgDom.onload = () => {
    const imgInstance = new fabric.Image(imgDom, {
      id: uuid(),
      name: '图片1',
      left: 100,
      top: 100
    })
    // 设置缩放

    // 删除页面中的图片元素
    imgDom.remove()
  }
}

function insertImg() {
  imgFile.value = ''
  showImgModal.value = true
}
function insert() {
  svgStr.value = ''
  svgFile.value = null
  showModal.value = true
}
</script>

<style scoped lang="less">
.import_file {
}
</style>
