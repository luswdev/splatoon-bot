'use strict'

const MiddleWare = require("./MiddleWare.js");

class MiddleWareTopgg extends MiddleWare {

    constructor (_key) {
        super(_key)
    }

    parser(_req, _res) {
        return {
            from: 'Top.gg',
            user: _req.body.user,
        }
    }
}

module.exports = MiddleWareTopgg
