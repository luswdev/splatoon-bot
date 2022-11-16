'use strict'

const express = require('express')
const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const MiddleWareTopgg = require('./middleware/MiddleWareTopgg.js')
const MiddleWareDcTW = require('./middleware/MiddleWareDcTW.js')
const MiddleWareDcLs = require('./middleware/MiddleWareDcLs.js')
const { hook } = require('../config.json')

class Hook {

    constructor () {
        this.webhookClient = new WebhookClient({ id: hook.id, token: hook.token })

        this.app = express()
        this.port = 3000

        this.middleware = {
            topgg: new MiddleWareTopgg(hook.topgg),
            dctw: new MiddleWareDcTW(hook.dctw),
            dcls: new MiddleWareDcLs(hook.dcls),
        }

        this.url = {
            topgg: 'https://top.gg/bot/898993695418908702/vote',
            dctw: 'https://discordservers.tw/bots/898993695418908702',
            dcls: 'https://discordbotlist.com/bots/splatoonbot'
        }

        this.rows = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL(this.url.topgg)
                .setLabel('Top.gg')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:topgg:1042278038831902770>'),
            )
            .addComponents( new ButtonBuilder()
                .setURL(this.url.dctw)
                .setLabel('DiscordTW')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:dctw:1042279725952946216>'),
            )
            .addComponents( new ButtonBuilder()
                .setURL(this.url.dcls)
                .setLabel('DiscordBotList')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:discordbotlist:720681545425223680>'),
            )
    }

    connect () {
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(express.json())

        this.app.post('/topgg', this.middleware.topgg.auth(), this.send())
        this.app.post('/dctw',  this.middleware.dctw.auth(),  this.send())
        this.app.post('/dcls',  this.middleware.dcls.auth(),  this.send())

        this.app.listen(this.port, () => {
            console.log(`[${__filename}] start listening at ${this.port}`)
        })
    }

    send () {
        return (req, res) => {
            if (!req.vote || !req.vote.user) {
                console.log(`[${__filename}] cannot read req.vote.user`)
                return res.status(403).json({ error: "null vote body" })
            }

            const reply = req.vote
            const str = JSON.stringify(reply)

            this.webhookClient.send({
                username: 'vote_agent',
                content: str
            })

            res.json(reply)
        }
    }

    formatEmbed (_log, _client) {
        console.log(`[${__filename}] parsing ${_log}`)

        let log = JSON.parse(_log)

        let embed = new EmbedBuilder()
            .setColor(0xB3FDDF)
            .setTitle(':star2: Thanks for voting!')
            .setDescription(`<@${log.user}> vote at ${log.from}`)
            .setFooter({ text: `${_client.user.username} | A simple bot for Splatoon 3`, iconURL: _client.user.displayAvatarURL()})
            .setTimestamp()

        return embed
    }
}

module.exports = Hook
