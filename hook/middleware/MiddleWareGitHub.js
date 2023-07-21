'use strict'

const { log } = require('utils/Log.js')

class MiddleWareGitHub {

    constructor (_key) {
        this.key = _key
    }

    auth () {
        return async (_req, _res, _next) => {
            const response = await this.parser(_req, _res)
            _req.update = response
            _next()
        }
    }

    parser (_req, _res) {
        return {
            from: 'github',
            data: _req.body.commits,
        }
    }
}

module.exports = MiddleWareGitHub
