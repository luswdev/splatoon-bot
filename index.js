'use strict'

const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
const { bot } = require('./config.json')

const { parseCmd } = require('./cmds/CmdList.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once('ready', () => {
    console.log(`[${__filename}] bot ready`)
    client.user.setActivity('Splatoon 3', { type: ActivityType.Playing })
})

client.on('interactionCreate', async interaction => {
    console.log(`[${__filename}] get interaction from: ${interaction.user.username ?? ''}`)
    if (!interaction.isChatInputCommand()) return

    const { commandName } = interaction

    console.log(`[${__filename}] parsing command: ${commandName}`)
    await parseCmd(commandName, interaction, client)

    console.log(`[${__filename}] end of ${commandName}`)
})

client.login(bot.token)
