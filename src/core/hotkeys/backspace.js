import hotkeys from 'hotkeys-js'

/**
 * @desc 监听backspan键盘
 * @param { Function } cb 回调函数
 * @returns 
 */
function onBackSpace(cb) {
    return hotkeys('backspace', function (event, handler){
        cb && typeof cb === 'function' && cb(event, handler)
    })
}

export default onBackSpace