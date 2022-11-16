'use strict'

const { REST, SlashCommandBuilder, Routes } = require('discord.js')
const { bot } = require('./config.json')

const { getCmdsJson } = require('./cmds/CmdList.js')

const { log } = require('./pkg/log.js')

const commands = getCmdsJson()

const rest = new REST({ version: '10' }).setToken(bot.token)

rest.put(Routes.applicationCommands(bot.client_id), { body: commands })
    .then((data) => log.write(`Successfully registered ${data.length} application commands.`))
    .catch(console.error)
