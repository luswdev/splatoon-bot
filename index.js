'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const { token } = require('./config.json')

const { parseCmd } = require('./cmds/CmdList.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once('ready', () => {
    console.log('bot ready')
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return

    const { commandName } = interaction

    console.log(`[${__filename}] parsing: ${commandName}`)
    await parseCmd(commandName, interaction)

    console.log(`[${__filename}] end of ${commandName}`)
})

client.login(token)
