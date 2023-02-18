'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const { readdirSync } = require('fs')
const { join } = require('path')

const { bot } = require('./config.json')

const { log } = require('./pkg/Log.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.events = readdirSync(join(__dirname, "./events"))
client.events.forEach( (event) => {
    let eventModule = require(`./events/${event}`);

    if (typeof eventModule !== "function") {
        log.write(`bad event: ${event}, skipped`)
        return
    }

    client.on(event.split(".")[0], (...args) => eventModule(client, ...args))
    log.write(`installed event: ${event}`)
});

client.login(bot.token)
