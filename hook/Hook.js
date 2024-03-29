'use strict'

const express = require('express')
const https = require('https')
const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const MiddleWareTopgg = require('hook/middleware/MiddleWareTopgg.js')
const MiddleWareDcTW = require('hook/middleware/MiddleWareDcTW.js')
const MiddleWareDcLs = require('hook/middleware/MiddleWareDcLs.js')
const MiddleWareGitHub = require('hook/middleware/MiddleWareGitHub.js')

const ConnDB = require('utils/ConnDB.js')
const { hook, hook_github, db } = require('config.json')

const { log } = require('utils/Log.js')

class Hook {

    constructor () {
        this.webhookClient = new WebhookClient({ id: hook.id, token: hook.token })
        this.webhookGitHubClient = new WebhookClient({ id: hook_github.id, token: hook_github.token })

        this.app = express()
        this.port = 3000

        this.middleware = {
            topgg: new MiddleWareTopgg(hook.topgg, hook.topgg_token),
            dctw: new MiddleWareDcTW(hook.dctw),
            dcls: new MiddleWareDcLs(hook.dcls),
            github: new MiddleWareGitHub(hook.github),
        }

        this.info = {
            topgg: {
                url: 'https://top.gg/bot/898993695418908702/vote',
                title: 'Top.gg',
                icon: '<:topgg:1042278038831902770>',
            },
            dctw: {
                url:'https://discordservers.tw/bots/898993695418908702',
                title: 'DiscordTW',
                icon: '<:dctw:1042279725952946216>',
            },
            dcls: {
                url: 'https://discordbotlist.com/bots/splatoonbot',
                title: 'DiscordBotList',
                icon: '<:discordlist:1042496781705027654>',
            },
        }

        this.title = {

        }

        this.rows = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL(this.info.topgg.url)
                .setLabel(this.info.topgg.title)
                .setStyle(ButtonStyle.Link)
                .setEmoji(this.info.topgg.icon),
            )
            .addComponents( new ButtonBuilder()
                .setURL(this.info.dctw.url)
                .setLabel(this.info.dctw.title)
                .setStyle(ButtonStyle.Link)
                .setEmoji(this.info.dctw.icon),
            )
            .addComponents( new ButtonBuilder()
                .setURL(this.info.dcls.url)
                .setLabel(this.info.dcls.title)
                .setStyle(ButtonStyle.Link)
                .setEmoji(this.info.dcls.icon),
            )

        this.mysql = new ConnDB(db)
    }

    connect () {
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(express.json())

        this.app.post('/topgg', this.middleware.topgg.auth(), this.send())
        this.app.post('/dctw',  this.middleware.dctw.auth(),  this.send())
        this.app.post('/dcls',  this.middleware.dcls.auth(),  this.send())
        this.app.post('/splatoonbotgithub', this.middleware.github.auth(), this.sendGitHub())

        this.app.listen(this.port, () => {
            log.write('start listening at', this.port)
        })
    }

    send () {
        return async (req, res) => {
            if (!req.vote || !req.vote.user) {
                log.write('cannot read req.vote.user')
                return res.status(403).json({ error: 'null vote body' })
            }

            const cnt = await this.mysql.voteHistory(req.vote.user, req.vote.from)

            const reply = req.vote
            reply['cnt'] = cnt

            let embed = this.formatEmbed(reply)

            this.webhookClient.send({
                username: 'Vote Agent 3',
                embeds: [embed]
            })

            res.json(reply)
        }
    }

    sendGitHub () {
        return async (req, res) => {
            const reply = 'ok'

            const commits = req.update.data
            const commitImgBase = 'https://opengraph.githubassets.com/9fb8f195aef3d6f7471c5a1b1d60397650fca42866203645c1974b4a8dea1ff8/luswdev/splatoon-bot/commit/'

            let embeds = []
            for (let commit of commits) {
                const commitTime = new Date(commit.timestamp)

                let embed = new EmbedBuilder()
                    .setColor(0x1e2327)
                    .setTitle('<:gh:1131837629281865768> GitHub Notification')
                    .setDescription(`[${commit.message}](${commit.url})`)
                    .addFields(
                        { name: 'Branch', value: req.body.ref },
                    )
                    .setImage(`${commitImgBase}${commit.id}`)
                    .setFooter({ text: `Commit by ${commit.committer.name}`, iconURL: `https://github.com/${commit.committer.username}.png`})
                    .setTimestamp(commitTime.getTime())

                embeds.push(embed)
            }

            if (embeds.length) {
                this.webhookGitHubClient.send({
                    username: 'GitHub Agent 3',
                    embeds: embeds
                })
            }

            res.json(reply)
        }
    }

    formatEmbed (_log) {
        log.write('parsing', _log)

        let res = _log

        let embed = new EmbedBuilder()
            .setColor(0xFFC8D0)
            .setTitle(':star2: Thanks for voting!')
            .setDescription(`<@${res.user}> voted on ${this.info[res.from].icon} [${this.info[res.from].title}](${this.info[res.from].url})\n\n` +
                            `You have voted \`${res.cnt}\` times!`)
            .addFields(
                { name: `${this.info.topgg.icon} ${this.info.topgg.title}`, value: `Vote on [${this.info.topgg.title}](${this.info.topgg.url}) every 12 hours!`, inline: true },
                { name: `${this.info.dctw.icon} ${this.info.dctw.title}`,   value: `Vote on [${this.info.dctw.title}](${this.info.dctw.url}) every 24 hours!`,   inline: true },
                { name: `${this.info.dcls.icon} ${this.info.dcls.title}`,   value: `Vote on [${this.info.dcls.title}](${this.info.dcls.url}) every 12 hours!`,   inline: true },
            )
            .setFooter({ text: `Vote for us | SplatoonBot`, iconURL: `https://cdn.discordapp.com/avatars/${hook.id}/${hook.avatar}.webp`})
            .setTimestamp()

        return embed
    }

    postStat(_count) {
        let payload = this.middleware.topgg.postStat(_count)
        let options = {
            method: payload.method,
            hostname: payload.hostname,
            path: payload.path,
            headers: payload.headers
        }

        let url = `https://${payload.hostname}${payload.path}`
        let req = https.request(url, options, (res) => {
            log.write(url, 'retCode:', res.statusCode)
            res.on('data', (d) => {
                log.write(url, 'return:', d.toString())
            })
        })

        req.on('error', (e) => {
            log.write(url, 'error:', e)
        })

        req.write(JSON.stringify(payload.body))
        req.end()
    }
}

module.exports = Hook
