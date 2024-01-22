'use strict'

const schedule = require('node-schedule')

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { readFileSync } = require('fs')

const database = require('utils/Database.js')
const { log } = require('utils/Log.js')
const { rotation_api } = require('config.json')

class RotationAncmt {

    constructor (_client, _channels) {
        this.client = _client

        this.channels = []
        _channels.forEach(ch => {
            _client.channels.fetch(ch.id).then( (el) => {
                this.channels.push({channel: el, locale: ch.locale})
            })
        })

        this.imgPath = rotation_api.store_path.image
        this.dataPath = rotation_api.store_path.data
    }

    startAncmt () {
        const rotation = 1
        this.channels.forEach(ch => {
            log.write('send rotation update', ch.locale)
            const lang = ch.locale
            const report = this.buildMessage(lang, rotation)
            ch.channel.send(report)
        })
    }

    schedule () {
        log.write('send rotation update every 2 hours')
        schedule.scheduleJob('0 */2 * * *', () => {
            this.startAncmt()
        })
    }

    fetchRotation (_idx) {
        const rotationStr = readFileSync(this.dataPath, {encoding:'utf8', flag:'r'})
        const rotation = JSON.parse(rotationStr)
        return rotation.battles[_idx]
    }

    buildEmbed(_rotation, _idx, _lang) {
        const mode =  database.getListObject('VSRule',  _rotation.mode)
        const match = database.getListObject('Match',   _rotation.match)
        const map1 =  database.getListObject('VSStage', _rotation.maps[0])
        const map2 =  database.getListObject('VSStage', _rotation.maps[1])

        const start = new Date(_rotation.period.start).getTime() / 1000
        const ends = new Date(_rotation.period.ends).getTime() / 1000

        const embed = new EmbedBuilder()
            .setColor(match.color)
            .setTitle(`${match.icon} ${match[_lang]}`)
            .setDescription(`<t:${start}> ~ <t:${ends}> (<t:${ends}:R>)`)
            .addFields(
                { name: `${mode.icon} ${mode[_lang]}`, value: `${map1[_lang]} :arrow_left: :arrow_right: ${map2[_lang]}` },
            )
            .setImage(`attachment://${_rotation.match}_${_idx}.png`)
            .setFooter({ text: '/rot', iconURL: this.client.user.displayAvatarURL()})
            .setTimestamp()

        return embed
    }

    buildMessage (_lang, _rotation) {
        const embeds = []
        const attachments = []
        const rotation = this.fetchRotation(_rotation)

        for (let i = 0; i < rotation.length; ++i) {
            if (rotation[i].mode !== null) {
                embeds.push(this.buildEmbed(rotation[i], _rotation, _lang))
                attachments.push(`${this.imgPath}${rotation[i].match}_${_rotation}.png`)
            }
        }

        const link = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL('https://splatoon3.ink/')
                .setLabel('Splatoon3.ink')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:splatoon3ink:1128347285403734126>'),
            )

        return { embeds: embeds, components: [link], files: attachments }
    }
}

module.exports = RotationAncmt
