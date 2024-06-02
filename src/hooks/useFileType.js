/*
 * @Author: 秦少卫
 * @Date: 2024-05-29 15:13:58
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-29 15:32:49
 * @Description: 文件夹分页
 */

import {
  createFileType as createFileTypeApi,
  getFileTypeList as getFileTypeListApi,
} from '@/api/user';
import { Spin } from 'view-ui-plus';
export default function useFileType() {
  const createFileType = async (fileTypeName, parentId = '') => {
    Spin.show();
    const res = await createFileTypeApi({
      data: {
        name: fileTypeName,
        parentId,
      },
    });
    Spin.hide();
    return res;
  };

  const getFileTypeList = async (params) => {
    Spin.show();
    const res = await getFileTypeListApi({
      data: params,
    });
    Spin.hide();
    return res;
  };

  return {
    createFileType,
    getFileTypeList,
  };
}
