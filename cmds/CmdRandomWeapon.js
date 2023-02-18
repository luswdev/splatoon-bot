'use strict'

const { EmbedBuilder } = require('discord.js')

const CmdBase = require('./CmdBase.js')
const { randomWeapon, weaponIdx, getWeapon, getLabel } = require('../data/Database.js')

class CmdRandomWeapon extends CmdBase {

    constructor () {
        super('rw')

        this.randomWeapon = randomWeapon
        this.imgUrlBase = 'https://leanny.github.io/splat3/images/weapon_flat/'
    }

    doCmd (_interaction) {
        const weapon = this.randomWeapon()
        const lang = this.locale2Lang(_interaction.locale) ?? 'en'
        const reply = this.buildMessage(weapon, lang, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const weapon = getWeapon(_option.res)
        const reply = this.buildMessage(weapon, _option.lang, _interaction)
        return reply
    }

    buildMessage (_weapon, _lang, _interaction) {
        const embed = new EmbedBuilder()
            .setColor(_weapon.color)
            .setTitle(`${this.cmdData.icon} ${getLabel('Random')[_lang]} ${getLabel('Weapon')[_lang]}!`)
            .setDescription(`${_weapon[_lang]}`)
            .setThumbnail(`${this.imgUrlBase}${_weapon.img}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const row = this.buildLangSelect({res: weaponIdx(_weapon)}, _lang)

        return { embeds: [embed], components: [row] }
    }
}

module.exports = CmdRandomWeapon
