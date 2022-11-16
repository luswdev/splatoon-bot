'use strict'

const mysql = require('mysql')

const { log } = require('../pkg/log.js')

class ConnDB {

    constructor (_config) {
        this.conn = mysql.createPool(_config)
        this.cmdTable = _config.cmd_table
        this.voteTable = _config.vote_table
    }

    saveResult (_cmd, _res, _user) {
        let query = this.conn.query(`INSERT INTO ${this.cmdTable} (user_id, command, result) VALUES (?, ?, ?)`, [_user, _cmd, _res])
        query
            .on('error', (err) => {
                log.write(`cannot save result, error: ${err}`)
            })
            .on('end', () => {
                log.write('save result end')
            })
    }

    checkUser (_user, _from) {
        return new Promise( (resolve, reject) => {
            let find = this.conn.query(`SELECT ${_from} FROM ${this.voteTable} WHERE user_id=(?)`, [_user], (err, ret) => {
                if (err) {
                    log.write(`cannot get user:${_user}, error: ${err}`)
                    reject(-1)
                }
                if (ret.length === 0) {
                    let query = this.conn.query(`INSERT INTO ${this.voteTable} (user_id) VALUES (?)`, [_user])
                    query
                        .on('error', (err) => {
                            log.write(`cannot new user:${_user}, error: ${err}`)
                            reject(-1)
                        })
                        .on('end', () => {
                            log.write(`new user:${_user} end`)
                            resolve(0)
                        })
                } else {
                    log.write(`get user:${_user} end`)
                    resolve(ret[0][_from])
                }
            })
        })
    }

    async voteHistory (_user, _from) {
        const ret = await this.checkUser(_user, _from)

        log.write(`check user: ${ret}`)
        if (ret == -1) return ret

        return new Promise( (resolve, reject) => {
            let query = this.conn.query(`UPDATE ${this.voteTable} SET ${_from} = ${_from}+1 WHERE user_id=(?)`, [_user])
            query
                .on('error', (err) => {
                    log.write(`cannot save result, error: ${err}`)
                    reject(ret)
                })
                .on('end', () => {
                    log.write('save result end')
                    resolve(ret + 1)
                })
        })
    }
}

module.exports = ConnDB
