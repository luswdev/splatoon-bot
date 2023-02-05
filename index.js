'use strict'

const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
const { bot } = require('./config.json')

const { parseCmd, parseSelect } = require('./cmds/CmdList.js')
const Hook = require('./hook/Hook.js')
const { splatoon3InkScheduler } = require('./pkg/Splatoon3Ink.js')

const { log } = require('./pkg/Log.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const hooks = new Hook()

client.once('ready', () => {
    log.write('bot ready')
    client.user.setActivity('Splatoon 3', { type: ActivityType.Playing })

    hooks.connect()

    splatoon3InkScheduler()
})

client.on('interactionCreate', async interaction => {
    log.write(`get interaction from: ${interaction.user.username ?? ''}`)

    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction

        log.write(`parsing command: ${commandName}`)
        await parseCmd(commandName, interaction, client)

        log.write(`end of ${commandName}`)
    } else if (interaction.isStringSelectMenu()) {
        const selected = JSON.parse(interaction.values[0])

        log.write(`command ${selected.cmd} change language to ${selected.lang}`)
        await parseSelect(selected, interaction)
    }
})

client.login(bot.token)
