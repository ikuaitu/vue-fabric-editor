/*
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-04 00:01:00
 * @Description: 自定义事件
 */

import EventEmitter from 'events'

class EventHandle extends EventEmitter {

    init(handler){
        this.handler = handler
        this.handler.on("selection:created", (e) => this._selected(e));
        this.handler.on("selection:updated",  (e) => this._selected(e));
        this.handler.on("selection:cleared", (e) => this._selected(e));
    }

    // 暴露单选多选事件
    _selected(e) {
        const actives = this.handler.getActiveObjects()
        if(actives && actives.length === 1) {
            this.emit('selectOne', actives)
        }else if(actives && actives.length > 1){
            this.mSelectMode = 'multiple'
            this.emit('selectMultiple', actives)
        }else{
            this.emit('selectCancel')
        }
    }
}


export default EventHandle