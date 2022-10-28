'use strict'

const mysql = require('mysql')

class ConnDB {

    constructor (_config) {
        this.conn = mysql.createPool(_config)
        this.table = _config.table
    }

    saveResult (_cmd, _res, _user) {
        let query = this.conn.query(`INSERT INTO ${this.table} (user_id, command, result) VALUES (?, ?, ?)`, [_user, _cmd, _res])
        query
            .on('error', (err) => {
                console.log(`[${__filename}] cannot save result, error: `, err)
            })
            .on('end', () => {
                console.log(`[${__filename}] save result end`)
            })
    }
}

module.exports = ConnDB
