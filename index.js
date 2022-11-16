'use strict'

const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
const { bot, hook} = require('./config.json')

const { parseCmd } = require('./cmds/CmdList.js')
const Hook = require('./hook/Hook.js')

const { log } = require('./pkg/log.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] })

const hooks = new Hook()

client.once('ready', () => {
    log.write('bot ready')
    client.user.setActivity('Splatoon 3', { type: ActivityType.Playing })

    hooks.connect()
})

client.on('interactionCreate', async interaction => {
    log.write(`get interaction from: ${interaction.user.username ?? ''}`)

    if (!interaction.isChatInputCommand()) return

    const { commandName } = interaction

    log.write(`parsing command: ${commandName}`)
    await parseCmd(commandName, interaction, client)

    log.write(`end of ${commandName}`)
})

client.on('messageCreate', (msg) => {
    if (msg.webhookId != hook.id) return

    let embed = hooks.formatEmbed(msg.content, client)
    let rows = hooks.rows

    client.channels.cache.get(hook.vote_channel).send({ embeds: [embed], components: [rows] })

    log.write('end of vote')
})

client.login(bot.token)