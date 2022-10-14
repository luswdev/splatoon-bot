'use strict'

class CmdBase {
    constructor (_key = '', _info = '') {
        this.cmdKey = _key
        this.cmdInfo = _info

        this.imgUrlBase = 'https://raw.githubusercontent.com/luswdev/SplatoonBot/bot-v1/img/';
    }
}

module.exports = CmdBase
