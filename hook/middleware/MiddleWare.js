'use strict'

class MiddleWare {

    constructor (_key) {
        this.key = _key
    }

    auth() {
        return async (_req, _res, _next) => {
            console.log(`[${__filename}] key: ${_req.headers.authorization}`)

            if (_req.headers.authorization !== this.key) {
                console.log(`[${__filename}] auth fail`)
                return _res.status(403).json({ error: "Unauthorized" })
            }

            const response = await this.parser(_req, _res)
            _req.vote = response
            _next()
        }
    }
}

module.exports = MiddleWare
