'use strict'

const schedule = require('node-schedule')

const { log } = require('utils/Log.js')

class BotInfo {

    constructor (_client) {
        this.client = _client
    }

    update () {
        this.client.guilds.fetch().then( () => {
            this.serverCnt = this.client.guilds.cache.size
            log.write('current served', this.serverCnt, 'servers')

            let totalGuildsMembers = this.client.guilds.cache.map( (guild) => guild.memberCount )
            this.memberCnt = totalGuildsMembers.reduce( (total, current) => total + current, this.client.users.cache.size)
            log.write('current served', this.memberCnt, 'users')
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
