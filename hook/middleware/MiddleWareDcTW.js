'use strict'

const MiddleWare = require("./MiddleWare.js");

class MiddleWareDcTW extends MiddleWare {

    constructor (_key) {
        super(_key)
    }

    parser(_req, _res) {
        return {
            from: 'dctw',
            user: _req.body.user.id,
        }
    }
}

module.exports = MiddleWareDcTW
