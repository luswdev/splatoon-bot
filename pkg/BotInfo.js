'use strict'

const schedule = require('node-schedule')

const { log } = require('./Log.js')

class BotInfo {

    constructor (_client) {
        this.client = _client
    }

    update () {
        this.client.guilds.fetch().then( () => {
            this.serverCnt = this.client.guilds.cache.size
            log.write(`current served ${this.serverCnt} server(s).`)

            let totalGuildsMembers = this.client.guilds.cache.map( (guild) => guild.memberCount )
            this.memberCnt = totalGuildsMembers.reduce( (total, current) => total + current, this.client.users.cache.size)
            log.write(`current served ${this.memberCnt} user(s).`)
        })
    }

    schedule () {
        log.write(`start fetch bot info every day in AM 5:00`)
        schedule.scheduleJob('* 5 * * *', () => {
            this.update()
        })
    }
}

module.exports = BotInfo
