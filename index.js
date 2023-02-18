'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const { readdirSync } = require('fs')
const { join } = require('path')

const { bot } = require('config.json')
const CmdList = require('commands/CmdList.js')

const { log } = require('utils/Log.js')
const depolyCmd = require('utils/deployCmds.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.events = readdirSync(join(__dirname, "./events"))
for (let event of client.events) {
    const eventModule = require(`./events/${event}`);

    if (typeof eventModule !== "function") {
        log.write(`bad event: ${event}, skipped`)
        continue
    }

    client.on(event.split(".")[0], (...args) => eventModule(client, ...args))
    log.write(`installed event: ${event}`)
}

client.cmdList = new CmdList()
const commands = readdirSync(join(__dirname, "./commands"))
for (let cmd of commands) {
    if (cmd === 'CmdList.js' || cmd === 'CmdBase.js' || cmd.indexOf('.json') !== -1) {
        continue
    }

    const cmdModule = require(`./commands/${cmd}`);

    if (typeof cmdModule !== "function") {
        log.write(`bad command: ${cmd}, skipped`)
        continue
    }

    const cmdClass = new cmdModule()
    client.cmdList.installCmd(cmdClass)
}

depolyCmd(client.cmdList.cmdsBuilder.map(command => command.toJSON()))

client.login(bot.token)
