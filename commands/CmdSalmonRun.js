'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { readFileSync } = require('fs')
const { basename } = require('path')

const CmdBase = require('commands/CmdBase.js')
const database = require('data/Database.js')
const { findImg } = require('utils/ImgFinder.js')

class CmdSalmonRun extends CmdBase {

    constructor () {
        super('sr')

        this.dataPath = '/tmp/spl3/rotation.json'

        this.randomWeapon = {
            normal: '<:salmon_rand:1080105843455971349>',
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
        return rotation.salmonRuns[_idx] ?? undefined
    }

    defaultEmbed (_lang, _interaction) {
        const match = database.getListObject('Salmon Run Next Wave', 'matches')
        const embed = new EmbedBuilder()
            .setColor(match.color)
            .setTitle(`${match.icon} ${match[_lang]}`)
            .setDescription(`No ${match[_lang]} now.`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        return embed
    }

    getImage (_rotation) {
        let map, thumb
        if (_rotation.bigRun) {
            map = database.getListObject(_rotation.map, 'maps')
            thumb = findImg('maps', map.en)
        } else {
            map = database.getListObject(_rotation.map, 'salmon_run')
            thumb = findImg('salmon_run', map.en)
        }

        return {...map, thumb: thumb}
    }

    buildEmbed(_rotation, _idx, _lang, _interaction) {
        const match = database.getListObject(_rotation.match, 'matches')
        let map = this.getImage(_rotation)

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
                { name: database.getListObject('Stage',  'labels')[_lang], value: map[_lang] ?? 'Unknown' },
            )
            .setImage(`attachment://${basename(map.thumb)}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        return embed
    }

    buildMessage (_lang, _rotation, _interaction) {
        const embeds = []
        const rotation = this.fetchRotation(_rotation)
        let thumb = []

        if (rotation) {
            thumb.push(this.getImage(rotation).thumb)
            embeds.push(this.buildEmbed(rotation, _rotation, _lang, _interaction))
        } else {
            embeds.push(this.defaultEmbed(_lang, _interaction))
        }

        const row = this.buildLangSelect({rotation: _rotation}, _lang)

        const link = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL('https://splatoon3.ink/salmonrun')
                .setLabel('More Information')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:squidgreen:568201618974048279>'),
            )

        return { embeds: embeds, components: [row, link], files: thumb }
    }
}

module.exports = CmdSalmonRun
