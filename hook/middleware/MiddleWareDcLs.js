'use strict'

const MiddleWare = require("./MiddleWare.js");

class MiddleWareDcLs extends MiddleWare {

    constructor (_key) {
        super(_key)
    }

    parser(_req, _res) {
        return {
            from: 'DiscordBotList',
            user: _req.body.id,
        }
    }
}

module.exports = MiddleWareDcLs
