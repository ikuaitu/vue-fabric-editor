<template>
  <div style="display: inline-block">
    <Button @click="insert" size="small">{{ $t('import_files') }}</Button>
    <Modal
      :title="$t('please_choose')"
      v-model="showModal"
      @on-ok="insertSvgFile"
      @on-cancel="cancel"
    >
      <Upload :before-upload="handleUpload" action="#">
        <Button icon="ios-cloud-upload-outline">{{ $t('select_json') }}</Button>
      </Upload>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref} from 'vue'


import { Message } from 'view-ui-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const showModal = ref(false)
const jsonFile = ref(null)

const insertSvgFile = () => {
  if (!jsonFile.value) return Message.error(t('alert.select_file'))
}
const cancel = () => {
  showModal.value = false
  jsonFile.value = null
}
const insert = () => {
  showModal.value = true
}
const handleUpload = (file: Blob) => {
  const reader = new FileReader()
  reader.readAsText(file, 'UTF-8')
  reader.onload = () => {
    jsonFile.value = reader.result
  }
  return false
}
</script>
