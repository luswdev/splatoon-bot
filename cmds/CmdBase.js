'use strict'

class CmdBase {

    constructor (_key = '', _info = '') {
        this.cmdKey = _key
        this.cmdInfo = _info
        this.infoUrlBase = 'https://splatoonwiki.org/wiki/'
    }

    infoUrl(_name) {
        if (typeof(_name) !== 'string') {
            return ''
        }

        let replaceSpace = _name.replace(' ', '_')
        return this.infoUrlBase + encodeURI(replaceSpace)
    }
}

module.exports = CmdBase
