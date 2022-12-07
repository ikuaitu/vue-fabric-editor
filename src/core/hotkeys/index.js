import hotkeys from 'hotkeys-js'

/**
 * @desc 快捷键
 * @param { String } keyName 快捷键
 * @param { Function } cb 
 */
function onHotKeys(keyName, cb) {
    return hotkeys(keyName, function (event, handler){
        cb && typeof cb === 'function' && cb(event, handler)
    })
}

export default onHotKeys