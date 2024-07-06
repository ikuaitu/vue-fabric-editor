<!--
 * @Author: 秦少卫
 * @Date: 2024-04-25 15:30:54
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-07-06 17:13:28
 * @Description: 我的素材
-->

<template>
  <div class="my-material">
    <Button icon="md-cloud-upload" @click="uploadImgHandule" long type="primary">
      {{ $t('myMaterial.uploadBtn') }}
    </Button>
    <div class="img-group" v-if="fileList.length">
      <Tooltip
        :content="info.name"
        v-for="(info, i) in fileList"
        :key="`${i}-bai1-button`"
        placement="top"
      >
        <div class="tmpl-img-box">
          <Icon
            type="ios-trash"
            class="del-btn"
            color="red"
            @click="removeMaterialHandle(info.id)"
          />
          <Image
            lazy
            :src="info.imgUrl"
            fit="contain"
            height="100%"
            :alt="info.name"
            @click="addImgByElement"
          />
        </div>
      </Tooltip>
    </div>
    <div class="tip" v-else>暂无素材</div>
  </div>
</template>

<script setup name="ImportTmpl">
const APP_APIHOST = import.meta.env.APP_APIHOST;
import { getFileList, uploadImg, createdMaterial, removeMaterial } from '@/api/user';
import { Utils } from '@kuaitu/core';
const { selectFiles } = Utils;
const canvasEditor = inject('canvasEditor');

const fileList = ref([]);
const isLogin = ref(false);
const getFileListHandle = () => {
  // 获取素材列表
  getFileList()
    .then((res) => {
      fileList.value = res.data.data.map((item) => {
        return {
          id: item.id,
          name: item.attributes.name,
          imgUrl: APP_APIHOST + item.attributes.img.data.attributes.url,
        };
      });
      isLogin.value = true;
    })
    .catch(() => {
      isLogin.value = false;
    });
};

getFileListHandle();

// 上传素材
const uploadImgHandule = () => {
  selectFiles({
    accept: 'image/*',
  }).then((fileList) => {
    const formData = new FormData();
    const time = new Date();
    const [file] = fileList;
    formData.append('files', file, `${time.getTime()}`);
    uploadImg(formData)
      .then((res) => {
        const [info] = res.data;
        createdH(info.id, file.name);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
// 创建素材
const createdH = (id, fileName) => {
  createdMaterial({
    data: {
      img: id,
      name: fileName,
    },
  }).finally(getFileListHandle);
};
// 添加素材到画布
const addImgByElement = async (e) => {
  const imgItem = await canvasEditor.createImgByElement(e.target);
  canvasEditor.addBaseType(imgItem, {
    scale: true,
  });
};

// 删除素材
const removeMaterialHandle = (id) => {
  removeMaterial(id).finally(getFileListHandle);
};
</script>

<style scoped lang="less">
.img-group {
  background: #eeeeeea1;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
}
.tmpl-img-box {
  width: 134px;
  height: 180px;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;
  text-align: center;

  &:hover {
    background: #e3e3e3;
    .del-btn {
      // opacity: 1;
      right: 5px;
    }
  }
}

.del-btn {
  z-index: 1;
  position: absolute;
  top: 5px;
  right: 1000000px;
}

.tip {
  text-align: center;
  padding: 10px;
}
</style>
