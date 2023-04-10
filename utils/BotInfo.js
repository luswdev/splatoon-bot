'use strict'

const schedule = require('node-schedule')
const Topgg = require('@top-gg/sdk')

const { log } = require('utils/Log.js')
const { hook } = require('config.json')

class BotInfo {

    constructor (_client) {
        this.client = _client
        this.TopggApi = new Topgg.Api(`${hook.topgg_token}`);
    }

    update () {
        this.client.guilds.fetch().then( () => {
            this.serverCnt = this.client.guilds.cache.size
            log.write('current served', this.serverCnt, 'servers')

            let totalGuildsMembers = this.client.guilds.cache.map( (guild) => guild.memberCount )
            this.memberCnt = totalGuildsMembers.reduce( (total, current) => total + current, this.client.users.cache.size)
            log.write('current served', this.memberCnt, 'users')

            this.TopggApi.postStats({
                serverCount: this.serverCnt,
            })
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
