'use strict'

const { EmbedBuilder } = require('discord.js');

const CmdBase = require('./CmdBase.js')
const { randomWeapon, randomColor } = require('../data/database.js')

class CmdRandomWeapon extends CmdBase {

    constructor () {
        super('rw', 'Random pick a weapon')

        this.randomWeapon = randomWeapon
        this.randomColor = randomColor

        this.imgUrlBase = 'https://leanny.github.io/splat3/images/weapon_flat/'
    }

    doCmd (_interaction) {
        const weapon = this.randomWeapon()
        const weaponEmbed = new EmbedBuilder()
            .setColor(this.randomColor())
            .setTitle('Random weapon!!')
            .setDescription(`${weapon.zh}\n` +
                            `${weapon.en}\n` +
                            `${weapon.jp}\n`)
            .setImage(`${this.imgUrlBase}${weapon.img}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        _interaction.reply({ embeds: [weaponEmbed] })
    }
}

module.exports = CmdRandomWeapon
