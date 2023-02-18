'use strict'

const { Client, GatewayIntentBits, ActivityType, Collection } = require('discord.js')
const { bot } = require('./config.json')

const { parseCmd, parseSelect } = require('./cmds/CmdList.js')
const Hook = require('./hook/Hook.js')
const { splatoon3InkScheduler } = require('./pkg/Splatoon3Ink.js')

const { log } = require('./pkg/Log.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const hooks = new Hook()

client.once('ready', async () => {
    log.write('bot ready')
    client.user.setActivity('Splatoon 3', { type: ActivityType.Playing })

    hooks.connect()

    splatoon3InkScheduler()

    client.commands = new Collection()
    client.commands = await client.application.commands.fetch()

    client.startTimestamp = Date.now()
})

client.on('interactionCreate', async interaction => {
    log.write(`get interaction from: ${interaction.user.username ?? ''}`)

    if (interaction.isChatInputCommand()) {
        await interaction.deferReply()

        const { commandName } = interaction

        log.write(`parsing command: ${commandName}`)
        let reply = parseCmd(commandName, interaction, client)
        await interaction.editReply(reply)

        log.write(`end of ${commandName}`)
    } else if (interaction.isStringSelectMenu()) {
        await interaction.deferUpdate()

        const selected = JSON.parse(interaction.values[0])

        log.write(`command ${selected.cmd} call select: ${JSON.stringify(selected)}`)
        let reply =  parseSelect(selected, interaction, client)
        await interaction.editReply(reply)

        log.write(`end of ${selected.cmd}`)
    }
})

client.login(bot.token)
