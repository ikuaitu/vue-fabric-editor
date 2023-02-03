/*
 * @Author: 秦少卫
 * @Date: 2023-02-03 21:50:10
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-03 23:58:54
 * @Description: 工作区初始化
 */

import { fabric } from 'fabric';

class EditorWorkspace {
    constructor(canvas, option){
        this.canvas = canvas
        this.workspaceEl = document.querySelector('#workspace')
        this.workspace = null
        this.option = option
        this._initBackground()
        this._initWorkspace()


        // this._initResizeObserve()
    }
    // 初始化背景
    _initBackground(){
        this.canvas.setBackgroundColor('#F1F1F1', this.canvas.renderAll.bind(this.canvas))
        this.canvas.backgroundImage = ''
        this.canvas.setWidth(this.workspaceEl.offsetWidth);
        this.canvas.setHeight(this.workspaceEl.offsetHeight);
    }
    // 初始化画布
    _initWorkspace(){
        const { width, height} = this.option
        const workspace = new fabric.Rect({
            fill: '#ffffff',
            width: width,
            height: height,
            id: 'workspace',
        });
        workspace.set('selectable',false)
        workspace.set('hasControls',false)

        this.canvas.add(workspace)
        this.canvas.centerObject(workspace)
        this.canvas.renderAll()

        this.workspace = workspace

        const scale = this.getScale()
        this.setZoomAuto(scale - 0.08)
    }


    // 初始化监听器
    _initResizeObserve(){
        // this.workspaceEl
        // const workspace = document.querySelector('#workspace')
      const resizeObserver = new ResizeObserver((entries) => {
        // const scale = this.getScale()
        // this.setZoomAuto(scale)
        this._initBackground()
        this.auto()
        // alert(scale)
        // const { width, height } = entries[0].contentRect
      //   const oldWidth = this.canvas.c.width
      //   const oldHeight = this.canvas.c.height
      //   const diffWidth = width / 2 - oldWidth / 2;
		  //   const diffHeight = height / 2 - oldHeight / 2;
      //   this.canvas.c.setWidth(width);
      //   this.canvas.c.setHeight(height);
        // const workspaceObj = this.canvas.getObjects().find(item => item.id === 'workspace')
        // if(workspaceObj){
        //   workspaceObj.center()
        //   this.setViewport()
        // }
      //   this.canvas.c.getObjects().forEach((obj) => {
			// 	if (obj.id !== 'workspace') {
			// 		const left = obj.left + diffWidth;
			// 		const top = obj.top + diffHeight;
			// 		obj.set({
			// 			left,
			// 			top,
			// 		});
			// 		obj.setCoords();
			// 	}
			// });
      //   this.canvas.c.renderAll()
      });
      resizeObserver.observe(this.workspaceEl);
    }

    setBgSize(scale) {
        const { workspaceEl } = this
        let width = workspaceEl.offsetWidth, height = workspaceEl.offsetHeight
        const newBgWidth = this.option.width * scale
        const newBgHeight = this.option.height * scale
        if(newBgWidth > workspaceEl.offsetWidth){
            width = newBgWidth
        }
        if(newBgHeight > workspaceEl.offsetHeight){
            height = newBgHeight
        }
        console.log(width, height)
        this.canvas.setWidth(width);
        this.canvas.setHeight(height);
        this.canvas.renderAll()
    }
    setZoomAuto(scale){
        const { workspaceEl } = this
        let width = workspaceEl.offsetWidth, height = workspaceEl.offsetHeight
        const newBgWidth = this.option.width * scale
        const newBgHeight = this.option.height * scale
        if(newBgWidth > workspaceEl.offsetWidth){
            width = newBgWidth
        }

        if(newBgHeight > workspaceEl.offsetHeight){
            height = newBgHeight
        }
        const center = this.canvas.getCenter()

        this.canvas.zoomToPoint(
            new fabric.Point(center.left, center.top),
            scale
        )
        this.canvas.centerObject(this.workspace)
        this.canvas.setWidth(width);
        this.canvas.setHeight(height);
        this.canvas.renderAll()
    }

    getScale(){
        const viewPortWidth = this.workspaceEl.offsetWidth
        const viewPortHeight = this.workspaceEl.offsetHeight
        if (viewPortWidth/viewPortHeight < this.option.width/this.option.height) {
            return viewPortWidth / this.option.width
        }else{ // 按照宽度缩放
            return viewPortHeight / this.option.height
        }
    }


    big(){
        let zoomRatio = this.canvas.getZoom();
        zoomRatio += 0.05;
        const center = this.canvas.getCenter()
        this.canvas.zoomToPoint(
            new fabric.Point(center.left, center.top),
            zoomRatio
        )
        // this.zoom = `${Math.round(zoomRatio * 100)}%`
    }

    small(){
        let zoomRatio = this.canvas.getZoom();
        zoomRatio -= 0.05;
        const center = this.canvas.getCenter()
        this.canvas.zoomToPoint(
            new fabric.Point(center.left, center.top),
            zoomRatio
        )
        // this.zoom = `${Math.round(zoomRatio * 100)}%`
    }


    auto(){
        const scale = this.getScale()
        this.setBgSize(scale)
        // const center = this.canvas.getCenter()
        // this.canvas.zoomToPoint({
        //     x: this.canvas.c.width/2,
        //     y: this.canvas.c.height/2
        // }, scale - 0.05)
        // this.canvas.zoomToPoint(
        //     new fabric.Point(center.left, center.top),
        //     scale - 0.05
        // )
        this.canvas.renderAll()
    }

    one(){
        // const scale = this.getScale()
        this.setBgSize(1)
        // const scale = this.getScale()
        const center = this.canvas.getCenter()
        this.canvas.zoomToPoint(
            new fabric.Point(center.left, center.top),
            1
        )
        this.canvas.renderAll()
    }

}

export default EditorWorkspace