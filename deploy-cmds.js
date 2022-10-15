'use strict'

const { REST, SlashCommandBuilder, Routes } = require('discord.js')
const { clientId, token } = require('./config.json')

const { getCmdsJson } = require('./cmds/CmdList.js')

const commands = getCmdsJson()


const rest = new REST({ version: '10' }).setToken(token)

rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error)