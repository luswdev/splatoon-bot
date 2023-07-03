'use strict'

const schedule = require('node-schedule')
const { EmbedBuilder } = require('discord.js')

const ConnDB = require('utils/ConnDB.js')
const { log } = require('utils/Log.js')
const { db } = require('config.json')
const cmds = require('commands/cmds.json')
const { version } = require('package.json')

const mysql = new ConnDB(db)

class Analytics {

    constructor (_client, _channel) {
        this.client = _client
        _client.channels.fetch(_channel).then( (ch) => this.channel = ch)
    }

    async report() {
        let report = []
        for (let cmd of cmds) {
            if (cmd.permission) {
                continue
            }

            let yesterdayCnt = await mysql.getCmdUsage(cmd.value)
            let totalCnt = await mysql.getCmdUsage(cmd.value, true)
            report.push({
                command: `${cmd.icon} ${cmd.value.toUpperCase()}`,
                yesterday: yesterdayCnt,
                total: totalCnt
            })
        }

        let yesterdayCnt = await mysql.getCmdUsage('')
        let totalCnt = await mysql.getCmdUsage('', true)
        report.push({
            command: '📦 Total',
            yesterday: yesterdayCnt,
            total: totalCnt
        })

        this.send(report)
    }

    send (_report) {
        const embed = new EmbedBuilder()
            .setColor(0xB3FDDF)
            .setTitle('📄 Daily Report')
            .setTimestamp()
            .setFooter({ text: `Daily Report`, iconURL: this.client.user.displayAvatarURL() })

        const yesterday = _report[_report.length - 1].yesterday
        const total = _report[_report.length - 1].total

        for (let cmd of _report) {
            let yesterdayPers = ((cmd.yesterday / yesterday) * 100).toFixed(2)
            let totalPers = ((cmd.total / total) * 100).toFixed(2)

            let field
            if (cmd.command.indexOf('Total') === -1) {
                field = {
                    name: cmd.command,
                    value: `Yesterday used \`${cmd.yesterday}\` times (\`${yesterdayPers}%\`)\nTotal \`${cmd.total}\` times (\`${totalPers}%\`)`
                }
            } else {
                field = {
                    name: cmd.command,
                    value: `Yesterday used \`${cmd.yesterday}\` times\nTotal \`${cmd.total}\` times`
                }
            }
            embed.addFields(field)
        }

        let botInfo = `\`${this.client.botInfo.serverCnt}\` servers(s)\n`
        botInfo += `\`${this.client.botInfo.memberCnt}\` member(s)\n`
        embed.addFields(
            { name: `📊 System Information`, value: botInfo },
            { name: `<:cogwheel:1095072752274247841>  Version`, value: `${version} (<t:${Math.floor(this.client.startTimestamp / 1000)}>)` },
        )

        this.channel.send({ embeds: [embed] })
    }

    schedule () {
        log.write('send bot usage report every 9:30')
        schedule.scheduleJob('30 9 * * *', () => {
            this.report()
        })
    }
}

module.exports = Analytics
