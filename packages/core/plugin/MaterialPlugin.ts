/*
 * @Author: 秦少卫
 * @Date: 2023-08-04 21:13:16
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-29 11:56:51
 * @Description: 素材插件
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
type IEditor = Editor;
import axios from 'axios';

class MaterialPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'MaterialPlugin';
  static apis = ['getTemplMaterialTypeList', 'getMaterialTypeList'];
  apiMapUrl: { [propName: string]: string };
  repoSrc: string;
  constructor(canvas: fabric.Canvas, editor: IEditor, config: { repoSrc: string }) {
    this.canvas = canvas;
    this.editor = editor;
    this.repoSrc = config.repoSrc;
    this.apiMapUrl = {
      template: config.repoSrc + '/template/type.json',
      svg: config.repoSrc + '/svg/type.json',
    };
  }

  getMaterialTypeList() {
    return axios
      .get(
        `${this.repoSrc}/api/material-types?populate[materials][populate]=*&pagination[pageSize]=100`
      )
      .then((res) => {
        const list = res.data.data.map((item: any) => {
          return {
            value: item.id,
            label: item.attributes.name,
            list: item.attributes.materials.data.map((info: any) => {
              return {
                value: info.id,
                label: info.attributes.name,
                tempUrl: this.repoSrc + this._getMaterialInfoUrl(info),
                src: this.repoSrc + info.attributes.img.data.attributes.url,
              };
            }),
          };
        });
        return list;
      });
  }

  getTemplMaterialTypeList() {
    return axios
      .get(`${this.repoSrc}/api/templ-types?populate[templs][populate]=*&pagination[pageSize]=100`)
      .then((res) => {
        const list = res.data.data.map((item: any) => {
          return {
            value: item.id,
            label: item.attributes.name,
            list: item.attributes.templs.data.map((info: any) => {
              return {
                value: info.id,
                label: info.attributes.name,
                src: this.repoSrc + this._getMaterialInfoUrl(info),
                json: info.attributes.json,
              };
            }),
          };
        });
        return list;
      });
  }

  _getMaterialInfoUrl(info: any) {
    if (
      info.attributes.img.data.attributes.formats &&
      info.attributes.img.data.attributes.formats.small &&
      info.attributes.img.data.attributes.formats.small.url
    ) {
      return info.attributes.img.data.attributes.formats.small.url;
    }
    return info.attributes.img.data.attributes.url;
  }

  async getMaterialInfo(typeId: string) {
    const url = this.apiMapUrl[typeId];
    const res = await axios.get(url, { params: { typeId } });
    return res.data.data;
  }
}

export default MaterialPlugin;
