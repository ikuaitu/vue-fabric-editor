import hotkeys from 'hotkeys-js'

/**
 * 快捷键ctrl+z
 * @param { Function } cb 回调函数 
 */
function onCtrlZ(cb) {
    return hotkeys('ctrl+z', function (event, handler){
        cb && typeof cb === 'function' && cb(event, handler)
    })
}

export default onCtrlZ