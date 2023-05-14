'use strict'

const schedule = require('node-schedule')

const ConnDB = require('utils/ConnDB.js')
const { log } = require('utils/Log.js')
const { db } = require('config.json')

class BotInfo {

    constructor (_client) {
        this.client = _client
        this.serverCnt = 0
        this.memberCnt = 0

        this.mysql = new ConnDB(db)
    }

    update () {
        this.client.guilds.fetch().then( () => {
            this.serverCnt = this.client.guilds.cache.size
            log.write('current served', this.serverCnt, 'servers')

            let totalGuildsMembers = this.client.guilds.cache.map( (guild) => guild.memberCount )
            this.memberCnt = totalGuildsMembers.reduce( (total, current) => total + current, this.client.users.cache.size)
            log.write('current served', this.memberCnt, 'users')

            this.client.hooks.postStat(this.serverCnt)
            this.mysql.saveBotInfo(this.serverCnt, this.memberCnt)
        })
    }

    schedule () {
        log.write('start fetch bot info every 5:00')
        schedule.scheduleJob('0 5 * * *', () => {
            this.update()
        })
    }
}

module.exports = BotInfo
