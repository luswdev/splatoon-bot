'use strict'

const mysql = require('mysql')

class ConnDB {

    constructor (_host, _user, _password, _database, _table) {
        this.conn = mysql.createConnection({
            host     : _host,
            user     : _user,
            password : _password,
            database : _database,
        })
        this.table = _table

        this.conn.connect()
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
