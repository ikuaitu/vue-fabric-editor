/*
 * @Author: 秦少卫
 * @Date: 2024-04-24 14:07:06
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-10-07 17:06:16
 * @Description: 用户接口登录
 */

import qs from 'qs';
import axios from 'axios';

import ApiClass from './apiClass';

const baseURL = import.meta.env.APP_APIHOST;

const instance = axios.create({ baseURL });

// web详情
export const getWebInfo = () => instance.get('/api/web-site?populate=*');

// 获取素材分类
export const getMaterialTypes = () => instance.get('/api/material-types');

// 获取素材列表
export const getMaterials = (data: any) => instance.get('/api/materials?' + data);

// 获取根据分类获取素材
export const getMaterialsByType = (data: any) =>
  instance.get('/api/materials?' + qs.stringify(data));

// 获取字体分类分类
export const getFontStyleTypes = () => instance.get('/api/font-style-types');

// 获取字体素材离别奥列表
export const getFontStyles = (data: any) => instance.get('/api/font-styles?' + data);

// 获取根据分类获取字体样式列表
export const getFontStyleListByType = (data: any) =>
  instance.get('/api/font-styles?' + qs.stringify(data));

// 获取字体分类分类
export const getTmplTypes = () => instance.get('/api/templ-types');
// 获取模板列表
export const getTmplList = (data: any) => instance.get('/api/templs?' + data);

// 获取banner
// export const getBannerList = (data: any) => instance.get('/api/banners?' + data);

// 新版 API---------------------
// 获取模板列表
export const templsApi = new ApiClass('/api/templs');
// 获取模板动态参数
export const customDynamicsApi = new ApiClass('/api/custom/dynamics');
// 获取模板渲染后的数据
export const customRenderApi = new ApiClass('/api/custom/render');
// 素材接口
export const commonMaterialsApi = new ApiClass('/api/materials');
// 素材分类
export const commonMaterialsTypeApi = new ApiClass('/api/material-types');
// 获取模板类型
export const commonTmplTypeApi = new ApiClass('/api/templ-types');
// 获取模板列表
export const commonTmplApi = new ApiClass('/api/templs');
// 获取组合元素分类
export const commonFontGroupTypeApi = new ApiClass('/api/font-style-types');
// 获取组合元素
export const commonFontGroupApi = new ApiClass('/api/font-styles');
// 获取字体列表
export const commonFontApi = new ApiClass('/api/fonts');
// 获取边框列表
export const commonFontStyleApi = new ApiClass('/api/fontborders');
// 获取画布大小
export const commonSizeApi = new ApiClass('/api/sizes');
// banner接口
export const commonBannerApi = new ApiClass('/api/banners');
