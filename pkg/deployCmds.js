'use strict'

const { REST, Routes } = require('discord.js')
const { bot } = require('../config.json')

const { log } = require('./Log.js')

module.exports = async (_commands) => {
    const rest = new REST({ version: '10' }).setToken(bot.token)

    rest.put(Routes.applicationCommands(bot.client_id), { body: _commands })
        .then((data) => log.write(`Successfully registered ${data.length} application commands.`))
        .catch(console.error)
}


