/*
 * @Author: 秦少卫
 * @Date: 2024-10-07 17:00:17
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-10-07 17:00:59
 * @Description: api接口格式化工具
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import qs from 'qs';
import _ from 'lodash-es';
const baseURL = import.meta.env.APP_APIHOST;
const tokenKey = 'token';
function getToken() {
  const token = localStorage.getItem(tokenKey);
  return token;
}

const getValue = (item: any) => {
  const newData: any = {
    id: item.id,
  };

  Object.keys(item.attributes).forEach((key) => {
    const info = item.attributes[key];
    newData[key] = info;
    if (_.isObject(info)) {
      const itemId = _.get(info, 'data.id');
      const itemUrl = _.get(info, 'data.attributes.url');
      const itemImgFormats = _.get(info, 'data.attributes.formats');
      // id、url、图片 Format 属性新增
      if (itemId) {
        newData[key + 'Id'] = itemId;
      }
      if (itemUrl) {
        newData[key + 'Url'] = baseURL + itemUrl;
      }
      if (itemImgFormats) {
        addImgFormat(newData, key, itemImgFormats);
      }
    }
  });
  return newData;
};

const addImgFormat = (data: any, key: string, item: any) => {
  Object.keys(item).forEach((imgKey) => {
    data[key + 'Url' + _.capitalize(imgKey)] = baseURL + item[imgKey].url;
  });
};

const mapValue = (arr: any) => {
  return arr.map((item: any) => getValue(item));
};

interface IPageParams {
  [key: string]: any;
  pagination?: {
    page: number;
    pageSize: number;
  };
}

export default class ServerApi {
  instance: AxiosInstance;
  apiPath: string;
  constructor(path: string, hasToken?: boolean) {
    this.apiPath = path;
    this.instance = this._initInstance(hasToken);
  }

  _initInstance(hasToken?: boolean) {
    const instance = axios.create({ baseURL });

    // 统一处理请求数据
    instance.interceptors.request.use(function (config: any) {
      const token = getToken();
      if (token && hasToken) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    // 统一处理返回数据
    instance.interceptors.response.use(function (response: AxiosResponse) {
      // console.log(, 'response');

      if (!response.config.skipResponse as any) {
        if (response.data?.data?.attributes) {
          response.data.data = getValue(response.data.data);
        }
        if (response.data?.data?.length) {
          response.data.data = mapValue(response.data.data);
        }
        if (response.data?.meta?.pagination) {
          response.data.pagination = response.data.meta.pagination;
          delete response.data.meta;
        }
      }
      return response.data;
    });
    return instance;
  }
  // 查询详情
  get(id: string | number, data = {}) {
    return this.instance.get(`${this.apiPath}/${id}?${qs.stringify(data)}`);
  }
  // 添加
  add(data = {}) {
    return this.instance.post(this.apiPath, data);
  }
  // 删除
  del(id: string | number) {
    return this.instance.delete(`${this.apiPath}/${id}`);
  }
  // 查找
  find(data = {} as IPageParams, pageSize?: number) {
    if (pageSize) {
      data.pagination = {
        page: 1,
        pageSize: 50,
      };
    }
    return this.instance.get(`${this.apiPath}/?${qs.stringify(data)}`);
  }
  // 更新
  update(id: string, data = {}) {
    return this.instance.put(`${this.apiPath}/${id}`, data);
  }

  IGet(data = {}, skip = true) {
    return this.instance.get(`${this.apiPath}`, {
      params: data,
      skipResponse: skip,
    });
  }
  IPost(data = {}, skip = true) {
    return this.instance.post(`${this.apiPath}`, data, {
      skipResponse: skip,
    });
  }
}
