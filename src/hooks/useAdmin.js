/*
 * @Author: 秦少卫
 * @Date: 2024-06-09 13:02:18
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-10 20:21:41
 * @Description: 管理面板管理
 */

import { updataTempl, uploadImg, deleteImg, getTempl, createdTempl } from '@/api/admin';
import { Spin } from 'view-ui-plus';

import { useRouter } from 'vue-router';

export default function useMaterial() {
  const canvasEditor = inject('canvasEditor');
  const router = useRouter();
  // 画布转图片
  const uploadFileToInfo = async () => {
    const dataURLtoFile = (dataurl, filename) => {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    };

    const upload = (base64) => {
      const file = dataURLtoFile(base64, '123.png');
      const formData = new FormData();
      const time = new Date();
      formData.append('files', file, `${time.getTime()}`);
      return uploadImg(formData)
        .then((res) => {
          const [info] = res.data;
          return info;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const base64 = await canvasEditor.preview();
    // 上传图片
    const fileInfo = await upload(base64);
    return fileInfo.id;
  };

  // 更新详情
  const updataTemplHander = async (id) => {
    Spin.show();
    try {
      const { data: info } = await getTempl(id);
      const newImgId = await uploadFileToInfo();
      const json = canvasEditor.getJson();
      await updataTempl(info.id, {
        ...info,
        img: newImgId,
        json,
      });
      deleteImg(info.img.id);
    } catch (error) {
      console.log(error);
    }

    Spin.hide();
  };

  const createdTemplHander = async (name) => {
    Spin.show();
    try {
      const newImgId = await uploadFileToInfo();
      const json = canvasEditor.getJson();
      const res = await createdTempl({
        name,
        img: newImgId,
        json,
      });
      router.replace('/?tempId=' + res.data.id + '&admin=true');
    } catch (error) {
      console.log(error);
    }

    Spin.hide();
  };
  return {
    updataTemplHander,
    createdTemplHander,
  };
}
