'use strict'

const { Client, GatewayIntentBits, ActivityType, Collection } = require('discord.js')
const { bot, db } = require('./config.json')

const { parseCmd, parseSelect } = require('./cmds/CmdList.js')
const Hook = require('./hook/Hook.js')
const { splatoon3InkScheduler } = require('./pkg/Splatoon3Ink.js')

const { log } = require('./pkg/Log.js')
const ConnDB = require('./pkg/ConnDB.js')
const BotInfo = require('./pkg/BotInfo.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const hooks = new Hook()
const mysql = new ConnDB(db)

client.once('ready', async () => {
    log.write('bot ready')
    client.user.setActivity('Splatoon 3', { type: ActivityType.Playing })

    hooks.connect()

    splatoon3InkScheduler()

    client.commands = new Collection()
    client.commands = await client.application.commands.fetch()

    client.startTimestamp = Date.now()
    client.botInfo = new BotInfo(client)

    client.botInfo.update()
    client.botInfo.schedule()
})

client.on('interactionCreate', async interaction => {
    log.write(`get interaction from: ${interaction.user.username ?? ''}, type: ${interaction.type}`)

    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction

        log.write(`parsing command: ${commandName}`)
        mysql.saveInteraction(commandName, interaction.user.id, interaction.type)

        await interaction.deferReply()

        let reply = parseCmd(commandName, interaction, client)
        await interaction.editReply(reply)

        log.write(`end of ${commandName}`)
    } else if (interaction.isStringSelectMenu()) {
        const selected = JSON.parse(interaction.values[0])

        log.write(`command ${selected.cmd} call select: ${JSON.stringify(selected)}`)
        mysql.saveInteraction(selected.cmd, interaction.user.id, interaction.type)

        if (selected.cmd === 'help') {
            await interaction.deferReply( { ephemeral: true } )
        } else {
            await interaction.deferUpdate()
        }

        let reply = parseSelect(selected, interaction, client)

        await interaction.editReply(reply)

        log.write(`end of ${selected.cmd}`)
    }
})

client.login(bot.token)
