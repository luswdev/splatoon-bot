'use strict'

const MiddleWare = require('hook/middleware/MiddleWare.js')

class MiddleWareDcLs extends MiddleWare {

    constructor (_key) {
        super(_key)
    }

    parser(_req, _res) {
        return {
            from: 'dcls',
            user: _req.body.id,
        }
    }
}

module.exports = MiddleWareDcLs
