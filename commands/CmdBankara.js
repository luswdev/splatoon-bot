'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { readFileSync } = require('fs')

const CmdBase = require('commands/CmdBase.js')
const database = require('utils/Database.js')

class CmdRotation extends CmdBase {

    constructor () {
        super('bankara')

        this.imgPath = '/tmp/spl3/img/'
        this.dataPath = '/tmp/spl3/rotation.json'
    }

    doCmd (_interaction) {
        const rotation = _interaction.options.getInteger('rotation') ?? 0
        const lang = this.locale2Lang(_interaction.locale) ?? 'en-US'
        const reply = this.buildMessage(lang, rotation, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const rotation = _option.rotation
        const reply = this.buildMessage(_option.lang, rotation, _interaction)
        return reply
    }

    doButton (_btn, _interaction) {
        const lang = _btn.lang
        const start = parseInt(_btn.res)
        const reply = this.buildMessage(lang, start, _interaction)
        return reply
    }

    fetchRotation (_idx) {
        const rotationStr = readFileSync(this.dataPath, {encoding:'utf8', flag:'r'})
        const rotation = JSON.parse(rotationStr)
        return rotation.battles[_idx]
    }

    defaultEmbed (_lang, _interaction) {
        const match = database.getListObject('Match', 'BankaraTitle')
        const embed = new EmbedBuilder()
            .setColor(match.color)
            .setTitle(`${match.icon} ${match[_lang].replaceAll(/\([.]*\)/ig, '')}`)
            .setDescription(`No ${match[_lang]} now.`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        return embed
    }

    buildEmbed(_rotation, _idx, _lang, _interaction) {
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
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        return embed
    }

    buildMessage (_lang, _rotation, _interaction) {
        const embeds = []
        const attachments = []
        const rotation = this.fetchRotation(_rotation)

        for (let i = 0; i < rotation.length; ++i) {
            if (rotation[i].match.indexOf('Bankara') !== -1 && rotation[i].mode !== null) {
                embeds.push(this.buildEmbed(rotation[i], _rotation, _lang, _interaction))
                attachments.push(`${this.imgPath}${rotation[i].match}_${_rotation}.png`)
            }
        }

        if (embeds.length === 0) {
            embeds.push(this.defaultEmbed(_lang, _interaction))
        }

        const langSelect = this.buildLangSelect({rotation: _rotation}, _lang)

        const btnNext =    {cmd: this.cmdKey, res: _rotation + 1, lang: _lang}
        const btnPrev =    {cmd: this.cmdKey, res: _rotation - 1, lang: _lang}
        const btnRefresh = {cmd: this.cmdKey, res: _rotation,     lang: _lang}
        const pager = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setCustomId(JSON.stringify(btnPrev))
                .setEmoji('<:leftarrow:1127627896094212206>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(_rotation === 0),
            )
            .addComponents( new ButtonBuilder()
                .setCustomId(JSON.stringify(btnRefresh))
                .setEmoji('<:reload:1127627899080544356>')
                .setStyle(ButtonStyle.Secondary),
            )
            .addComponents( new ButtonBuilder()
                .setCustomId(JSON.stringify(btnNext))
                .setEmoji('<:rightarrow:1127627892692627598>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(_rotation === (this.options[0].max)),
            )

        const link = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL('https://splatoon3.ink/salmonrun')
                .setLabel('Splatoon3.ink')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:splatoon3ink:1128347285403734126>'),
            )

        return { embeds: embeds, components: [langSelect, pager, link], files: attachments }
    }
}

module.exports = CmdRotation
