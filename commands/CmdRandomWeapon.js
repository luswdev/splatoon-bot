'use strict'

const { EmbedBuilder } = require('discord.js')
const { basename } = require('path')

const CmdBase = require('commands/CmdBase.js')
const database = require('data/Database.js')
const { findImg } = require('utils/ImgFinder.js')

class CmdRandomWeapon extends CmdBase {

    constructor () {
        super('rw')
    }

    doCmd (_interaction) {
        const weapon = database.randomList(database.dataList['weapons'])
        const lang = this.locale2Lang(_interaction.locale) ?? 'en'
        const reply = this.buildMessage(weapon, lang, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const weapon = database.getListObject(_option.res, 'weapons')
        const reply = this.buildMessage(weapon, _option.lang, _interaction)
        return reply
    }

    buildMessage (_weapon, _lang, _interaction) {
        const thumb = findImg('weapons', _weapon.en)
        const embed = new EmbedBuilder()
            .setColor(_weapon.color)
            .setTitle(`${this.cmdData.icon} ${database.getListObject('Random', 'labels')[_lang]} ${database.getListObject('Weapon', 'labels')[_lang]}!`)
            .setDescription(`${_weapon[_lang]}`)
            .setThumbnail(`attachment://${basename(thumb)}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const row = this.buildLangSelect({res: database.getListIdx(_weapon, 'weapons')}, _lang)

        return { embeds: [embed], components: [row], files: [thumb] }
    }
}

module.exports = CmdRandomWeapon
