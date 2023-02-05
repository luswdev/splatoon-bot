'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { readFileSync } = require('fs')

const CmdBase = require('./CmdBase.js')
const { getMap, getMode, getMatch } = require('../data/Database.js')

class CmdRotation extends CmdBase {

    constructor () {
        super('rot', '查看現在的地圖 get current maps rotation', [{type: 'integer', name: 'rotation', info: '第幾輪模式 Which Rotation?', min: 0, max:11}])

        this.imgPath = '/tmp/spl3/img/'
        this.dataPath = '/tmp/spl3/rotation.json'
    }

    doCmd (_interaction) {
        const rotation = _interaction.options.getInteger('rotation') ?? 0
        const lang = this.locale2Lang(_interaction.locale) ?? 'en'
        const reply = this.buildMessage(lang, rotation, _interaction)
        _interaction.reply(reply)
    }

    updateLang (_option, _interaction) {
        const rotation = _option.rotation
        const reply = this.buildMessage(_option.lang, rotation, _interaction)
        _interaction.update(reply)
    }

    fetchRotation (_idx) {
        const rotationStr = readFileSync(this.dataPath, {encoding:'utf8', flag:'r'})
        const rotation = JSON.parse(rotationStr)
        return rotation[_idx]
    }

    buildEmbed(_rotation, _idx, _lang, _interaction) {
        const mode = getMode(_rotation.mode)
        const match = getMatch(_rotation.match)
        const map1 = getMap(_rotation.maps[0])
        const map2 = getMap(_rotation.maps[1])

        const start = new Date(_rotation.period.start).getTime() / 1000
        const ends = new Date(_rotation.period.ends).getTime() / 1000

        const embed = new EmbedBuilder()
            .setColor(match.color)
            .setTitle(`${match.icon} ${match[_lang]}`)
            .setDescription(`<t:${start}> ~ <t:${ends}>`)
            .addFields(
                { name: `${mode.icon} ${mode[_lang]}`, value: `${map1[_lang]} :arrow_left: :arrow_right: ${map2[_lang]}` },
            )
            .setImage(`attachment://${match.en.replaceAll(' ', '_').replaceAll('(', '').replaceAll(')', '')}_${_idx}.png`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        return embed
    }

    buildMessage (_lang, _rotation, _interaction) {
        const embeds = []
        const attachments = []
        const rotation = this.fetchRotation(_rotation)

        for (let i = 0; i < 4; ++i) {
            embeds.push(this.buildEmbed(rotation[i], _rotation, _lang, _interaction))
            attachments.push(`${this.imgPath}${rotation[i].match}_${_rotation}.png`)
        }

        const row = this.buildLangSelect({rotation: _rotation}, _lang)

        const link = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL('https://splatoon3.ink')
                .setLabel('More Information')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:squidgreen:568201618974048279>'),
            )

        return { embeds: embeds, components: [row, link], files: attachments }
    }
}

module.exports = CmdRotation
