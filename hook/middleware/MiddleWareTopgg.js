'use strict'

const MiddleWare = require('hook/middleware/MiddleWare.js')

class MiddleWareTopgg extends MiddleWare {

    constructor (_key, _token) {
        super(_key)
        this.apiHost = 'top.gg'
        this.apiBase = '/api'
        this.token = _token
    }

    parser(_req, _res) {
        return {
            from: 'topgg',
            user: _req.body.user,
        }
    }

    postStat(_count) {
        return {
            method: 'POST',
            hostname: this.apiHost,
            path: `${this.apiBase}/bots/stats`,
            headers: {
                'content-type': 'application/json',
                'authorization': this.token,
            },
            body: {
                server_count: _count
            }
        }
    }
}

module.exports = MiddleWareTopgg
