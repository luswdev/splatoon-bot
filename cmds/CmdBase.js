'use strict'

class CmdBase {
    constructor (_key = '', _info = '') {
        this.cmdKey = _key
        this.cmdInfo = _info
    }
}

module.exports = CmdBase
