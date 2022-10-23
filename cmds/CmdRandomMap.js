'use strict'

const { EmbedBuilder } = require('discord.js');
const CmdBase = require('./CmdBase.js')
const { randomMap } = require('../data/database.js')

class CmdRandomMap extends CmdBase {

    constructor () {
        super('rm', 'Random pick a map')

        this.randomMap = randomMap
        this.imgUrlBase = 'https://raw.githubusercontent.com/luswdev/splatoon-bot/bot-v2/img/map/'
    }

    doCmd (_interaction) {
        const map = this.randomMap()
        const mapEmbed = new EmbedBuilder()
            .setColor(map.color)
            .setTitle(':map: Your random map')
            .setURL(this.infoUrl(map.en))
            .addFields(
                { name: '場地', value: map.zh},
                { name: 'Stage', value: map.en},
                { name: 'ステージ', value: map.jp},
            )
            .setThumbnail(`${this.imgUrlBase}${map.img}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        this.mysql.saveResult(this.cmdKey, map.en, _interaction.user.id)

        _interaction.reply({ embeds: [mapEmbed] })
    }
}

module.exports = CmdRandomMap
