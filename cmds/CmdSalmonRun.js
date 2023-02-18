'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { readFileSync } = require('fs')

const CmdBase = require('./CmdBase.js')
const database = require('../data/Database.js')

class CmdSalmonRun extends CmdBase {

    constructor () {
        super('sr')

        this.imgPath = 'https://splatoon3.ink/assets/splatnet/stage_img/icon/high_resolution/'
        this.dataPath = '/tmp/spl3/rotation.json'

        this.randomWeapon = {
            normal: '<:Coop_Random:1075466256469196801>',
            rare: '<:salmon_rare:1075463948075274281>'
        }
    }

    doCmd (_interaction) {
        const rotation = _interaction.options.getInteger('rotation') ?? 0
        const lang = this.locale2Lang(_interaction.locale) ?? 'en'
        const reply = this.buildMessage(lang, rotation, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const rotation = _option.rotation
        const reply = this.buildMessage(_option.lang, rotation, _interaction)
        return reply
    }

    fetchRotation (_idx) {
        const rotationStr = readFileSync(this.dataPath, {encoding:'utf8', flag:'r'})
        const rotation = JSON.parse(rotationStr)
        return rotation.salmonRuns[_idx]
    }

    buildEmbed(_rotation, _idx, _lang, _interaction) {
        const match = database.getListObject(_rotation.match, 'matches')
        const map   = database.getListObject(_rotation.map,   'salmon_run')
        let weapons = ''
        for (let weapon of _rotation.weapons) {
            if (weapon.indexOf('Random') !== -1) {
                let random = database.getListObject('Random', 'labels')
                if (weapon === 'Random_edcfecb7e8acd1a7') {
                    weapons += `${this.randomWeapon.rare}`
                } else {
                    weapons += `${this.randomWeapon.normal}`
                }
                weapons += ` ${random[_lang]}\n`
            } else {
                let weaponData = database.getListObject(weapon, 'weapons')
                weapons += `${weaponData.icon} ${weaponData[_lang]}\n`
            }
        }

        const start = new Date(_rotation.period.start).getTime() / 1000
        const ends = new Date(_rotation.period.ends).getTime() / 1000
        const embed = new EmbedBuilder()
            .setColor(match.color)
            .setTitle(`${match.icon} ${match[_lang]}`)
            .setDescription(`<t:${start}> ~ <t:${ends}> (<t:${ends}:R>)`)
            .addFields(
                { name: database.getListObject('Weapon', 'labels')[_lang], value: weapons },
                { name: database.getListObject('Stage',  'labels')[_lang], value: map[_lang] },
            )
            .setImage(`${this.imgPath}/${map.img}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        return embed
    }

    buildMessage (_lang, _rotation, _interaction) {
        const embeds = []
        const attachments = []
        const rotation = this.fetchRotation(_rotation)

        embeds.push(this.buildEmbed(rotation, _rotation, _lang, _interaction))

        const row = this.buildLangSelect({rotation: _rotation}, _lang)

        const link = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL('https://splatoon3.ink/salmonrun')
                .setLabel('More Information')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:squidgreen:568201618974048279>'),
            )

        return { embeds: embeds, components: [row, link], files: attachments }
    }
}

module.exports = CmdSalmonRun
