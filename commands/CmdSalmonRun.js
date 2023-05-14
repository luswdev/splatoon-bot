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
        const salmon = rotation.salmonRuns[_idx] ?? undefined
        const team = rotation.teamContests[0] ?? undefined  // always get idx 0
        return { salmon: salmon, team: team }
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

    checkTeamContestInPeriod(_team, _salmon) {
        if (!_team || !_salmon) {
            return false
        }

        const teamEnd = new Date(_team.period.ends).getTime()
        const salmonStart = new Date(_salmon.period.start).getTime()

        return (teamEnd >= salmonStart)
    }


    buildEmbed(_rotation, _idx, _lang, _interaction) {
        const match = database.getListObject(_rotation.match, 'matches')
        let map = this.getImage(_rotation)
        let bossThumb = findImg('boss', _rotation.boss)

        let weapons = ''
        for (let weapon of _rotation.weapons) {
            if (weapon.indexOf('Random') !== -1) {
                let random = database.getListObject('Random', 'labels')
                if (weapon === 'RareRandom') {
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

        if (bossThumb.indexOf('Unknown') === -1) {
            embed.setThumbnail(`attachment://${basename(bossThumb)}`)
        }

        return embed
    }

    buildMessage (_lang, _rotation, _interaction) {
        const embeds = []
        const rotation = this.fetchRotation(_rotation)
        let thumb = []

        if (rotation.salmon) {
            thumb.push(this.getImage(rotation.salmon).thumb)
            thumb.push(findImg('boss', rotation.salmon.boss))
            embeds.push(this.buildEmbed(rotation.salmon, _rotation, _lang, _interaction))
        } else {
            embeds.push(this.defaultEmbed(_lang, _interaction))
        }

        if (rotation.team && this.checkTeamContestInPeriod(rotation.team, rotation.salmon)) {
            thumb.push(this.getImage(rotation.team).thumb)
            embeds.push(this.buildEmbed(rotation.team, _rotation, _lang, _interaction))
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
