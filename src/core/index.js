/*
 * @Author: 秦少卫
 * @Date: 2023-02-03 23:29:34
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-04 00:00:08
 * @Description: 核心入口文件
 */
import EventEmitter from 'events'
import { fabric } from 'fabric';

class Editor extends EventEmitter {
    constructor(canvas, option){
        super()

        this.canvas = canvas
        this.editorWorkspace = null
    }
}

export default Editor