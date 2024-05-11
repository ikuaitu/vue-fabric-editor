/*
 * @Author: 秦少卫
 * @Date: 2024-05-11 11:51:59
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 15:46:39
 * @Description: 素材相关
 */

import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { uploadImg, createdTempl, getTmplInfo, updataTempl, removeTempl } from '@/api/user';
import { Modal } from 'view-ui-plus';

import { useI18n } from 'vue-i18n';

export default function useMaterial() {
  const { t } = useI18n();
  const router = useRouter();
  const canvasEditor = inject('canvasEditor');

  // 创建模板
  const createTmpl = async (width, height) => {
    canvasEditor.clear();
    canvasEditor.setSize(width, height);
    const name = dayjs().format('YYYY[年]MM[月]DD[日]HH[小时]mm[分钟]ss[秒]') + '创建的作品';
    const data = await getCanvasCommonData();

    // 上传图片
    const templInfo = await createdTempl({
      data: {
        ...data,
        name,
      },
    });
    return templInfo;
  };

  const createTmplByCommon = async () => {
    const name = dayjs().format('YYYY[年]MM[月]DD[日]HH[小时]mm[分钟]ss[秒]') + '创建的作品';
    const data = await getCanvasCommonData();
    // 上传图片
    const templInfo = await createdTempl({
      data: {
        ...data,
        name,
      },
    });
    return templInfo;
  };

  // 获取画布数据
  const getCanvasCommonData = async () => {
    const json = canvasEditor.getJson();
    const fileInfo = await uploadFileToInfo();
    return {
      json,
      img: fileInfo.id,
      desc: '',
    };
  };

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
    return fileInfo;
  };

  // 更新路由
  const routerToId = (id) => {
    router.replace('/?id=' + id);
  };

  // 获取详情
  const getTemplInfo = async (id) => {
    const res = await getTmplInfo(id);
    return res.data;
  };

  // 更新详情
  const updataTemplInfo = async (id, name) => {
    const data = await getCanvasCommonData();
    name && (data.name = name);
    await updataTempl(id, {
      data,
    });
  };

  const removeTemplInfo = (id) => {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: t('my_spase.remove_templ'),
        content: `<p>${t('my_spase.remove_templTip')}</p>`,
        onOk: () => {
          removeTempl(id).then(resolve).catch(reject);
        },
      });
    });
  };
  return {
    createTmpl,
    createTmplByCommon,
    getTemplInfo,
    updataTemplInfo,
    removeTemplInfo,
    routerToId,
  };
}
