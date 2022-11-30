'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const CmdBase = require('./CmdBase.js')
const { randomWeapon } = require('../data/database.js')

class CmdRandomWeapon extends CmdBase {

    constructor () {
        super('rw', '隨機武器 Random pick a weapon')

        this.randomWeapon = randomWeapon
        this.imgUrlBase = 'https://leanny.github.io/splat3/images/weapon_flat/'
    }

    doCmd (_interaction) {
        const weapon = this.randomWeapon()
        const weaponEmbed = new EmbedBuilder()
            .setColor(weapon.color)
            .setTitle(':crossed_swords: Your random weapon')
            .addFields(
                { name: '武器', value: weapon.zhTW},
                { name: 'Weapon', value: weapon.en},
                { name: 'ブキ', value: weapon.ja},
            )
            .setThumbnail(`${this.imgUrlBase}${weapon.img}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const row = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL(this.infoUrl(weapon.en))
                .setLabel('Inkipedia')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:Squid:1021583273828306974>'),
            )

        this.mysql.saveResult(this.cmdKey, weapon.en, _interaction.user.id)

        _interaction.reply({ embeds: [weaponEmbed], components: [row] })
    }
}

module.exports = CmdRandomWeapon
