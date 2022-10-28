'use strict'

const ConnDB = require('../data/mysql.js')
const { db } = require('../config.json')

class CmdBase {

    constructor (_key = '', _info = '') {
        this.cmdKey = _key
        this.cmdInfo = _info
        this.infoUrlBase = 'https://splatoonwiki.org/wiki/'

        this.mysql = new ConnDB(db)
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
