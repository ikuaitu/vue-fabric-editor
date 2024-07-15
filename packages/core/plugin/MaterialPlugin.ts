/*
 * @Author: 秦少卫
 * @Date: 2023-08-04 21:13:16
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 14:20:26
 * @Description: 素材插件
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
type IEditor = Editor;
import axios from 'axios';
import qs from 'qs';

class MaterialPlugin implements IPluginTempl {
  static pluginName = 'MaterialPlugin';
  static apis = [
    'getTemplTypeList',
    'getTemplList',
    'getMaterialTypeList',
    'getMaterialList',
    'getSizeList',
  ];
  apiMapUrl: { [propName: string]: string };
  repoSrc: string;
  constructor(public canvas: fabric.Canvas, public editor: IEditor, config: { repoSrc: string }) {
    this.repoSrc = config.repoSrc;
    this.apiMapUrl = {
      template: config.repoSrc + '/template/type.json',
      svg: config.repoSrc + '/svg/type.json',
    };
  }
  // 获取模板分类
  getTemplTypeList() {
    return axios.get(`${this.repoSrc}/api/templ-types?pagination[pageSize]=100`).then((res) => {
      const list = res.data.data.map((item: any) => {
        return {
          value: item.id,
          label: item.attributes.name,
        };
      });
      return list;
    });
  }
  // 分页获取模板列表
  getTemplList(templType = '', index = 1, searchKeyword = '') {
    const query = {
      fields: '*',
      populate: {
        img: '*',
      },
      filters: {},
      pagination: {
        page: index,
        pageSize: 10,
      },
    };

    const queryParams = this._getQueryParams(query, [
      {
        key: 'templ_type',
        value: templType,
        type: '$eq',
      },
      {
        key: 'name',
        value: searchKeyword,
        type: '$contains',
      },
    ]);

    return axios.get(`${this.repoSrc}/api/templs?${queryParams}`).then((res: any) => {
      const list = res.data.data.map((item: any) => {
        return {
          name: item.attributes.name,
          desc: item.attributes.desc,
          src: this._getMaterialPreviewUrl(item.attributes.img),
          json: item.attributes.json,
        };
      });
      return { list, pagination: res?.data?.meta?.pagination };
    });
  }

  /**
   * @description: 获取素材分类
   * @return {Promise<any>}
   */
  getMaterialTypeList() {
    return axios.get(`${this.repoSrc}/api/material-types?pagination[pageSize]=100`).then((res) => {
      const list = res.data.data.map((item: any) => {
        return {
          value: item.id,
          label: item.attributes.name,
        };
      });
      return list;
    });
  }

  /**
   * @description: 获取素材列表
   * @returns Promise<Array>
   */
  getMaterialList(materialType = '', index = 1, searchKeyword = '') {
    const query = {
      populate: {
        img: '*',
      },
      // fields: ['materialType'],
      filters: {},
      pagination: {
        page: index,
        pageSize: 50,
      },
    };

    const queryParams = this._getQueryParams(query, [
      {
        key: 'material_type',
        value: materialType,
        type: '$eq',
      },
      {
        key: 'name',
        value: searchKeyword,
        type: '$contains',
      },
    ]);

    return axios.get(`${this.repoSrc}/api/materials?${queryParams}`).then((res: any) => {
      const list = res.data.data.map((item: any) => {
        return {
          name: item.attributes.name,
          desc: item.attributes.desc,
          src: this._getMaterialInfoUrl(item.attributes.img),
          previewSrc: this._getMaterialPreviewUrl(item.attributes.img),
        };
      });
      return { list, pagination: res?.data?.meta?.pagination };
    });
  }

  getSizeList() {
    return axios.get(`${this.repoSrc}/api/sizes?pagination[pageSize]=100`).then((res) => {
      const list = res.data.data.map((item: any) => {
        return {
          value: item.id,
          name: item.attributes.name,
          width: Number(item.attributes.width),
          height: Number(item.attributes.height),
          unit: item.attributes.unit,
        };
      });
      return list;
    });
  }
  getFontList() {
    return axios.get(`${this.repoSrc}/api/fonts?pagination[pageSize]=100`).then((res) => {
      const list = res.data.data.map((item: any) => {
        return {
          value: item.id,
          label: item.attributes.name,
        };
      });
      return list;
    });
  }

  _getMaterialInfoUrl(info: any) {
    const imgUrl = info?.data?.attributes?.url || '';
    return this.repoSrc + imgUrl;
  }

  _getMaterialPreviewUrl(info: any) {
    const imgUrl = info?.data?.attributes?.formats?.small?.url || info?.data?.attributes?.url || '';
    return this.repoSrc + imgUrl;
  }

  // 拼接查询条件参数
  _getQueryParams(option: any, filters: any) {
    filters.forEach((item: any) => {
      const { key, value, type } = item;
      if (value) {
        option.filters[key] = { [type]: value };
      }
    });
    return qs.stringify(option);
  }

  async getMaterialInfo(typeId: string) {
    const url = this.apiMapUrl[typeId];
    const res = await axios.get(url, { params: { typeId } });
    return res.data.data;
  }
}

export default MaterialPlugin;
