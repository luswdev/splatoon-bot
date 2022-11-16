'use strict'

const { log } = require('../../pkg/log.js')

class MiddleWare {

    constructor (_key) {
        this.key = _key
    }

    auth() {
        return async (_req, _res, _next) => {
            log.write(`key: ${_req.headers.authorization}`)

            if (_req.headers.authorization !== this.key) {
                log.write('auth fail')
                return _res.status(403).json({ error: "Unauthorized" })
            }

            const response = await this.parser(_req, _res)
            _req.vote = response
            _next()
        }
    }
}

module.exports = MiddleWare
