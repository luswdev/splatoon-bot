'use strict'

const { ActivityType, Collection } = require('discord.js')
const EvtBase = require('events/EvtBase')

const Hook = require('hook/Hook.js')

const { splatoon3InkScheduler } = require('utils/Splatoon3Ink.js')
const BotInfo = require('utils/BotInfo.js')
const { log } = require('utils/Log.js')

class EvtReady extends EvtBase {

    constructor () {
        super('ready')
    }

    async eventCallback (_client) {
        _client.user.setActivity('Splatoon 3', { type: ActivityType.Playing })

        const hooks = new Hook()
        hooks.connect()

        splatoon3InkScheduler()

        _client.commands = new Collection()
        _client.commands = await _client.application.commands.fetch()

        _client.startTimestamp = Date.now()
        _client.botInfo = new BotInfo(_client)

        _client.botInfo.update()
        _client.botInfo.schedule()

        log.write('bot ready')
    }
}

module.exports = EvtReady
