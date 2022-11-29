import hotkeys from 'hotkeys-js'

/**
 * @desc 监听上下左右
 * @param { Function } cb 
 */
function onLRDU(cb) {
    return hotkeys('left,right,down,up', function (event, handler){
        cb && typeof cb === 'function' && cb(event, handler)
    })
}

export default onLRDU