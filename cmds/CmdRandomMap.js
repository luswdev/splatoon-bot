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
            .setTitle(':map: Random Map!!')
            .setDescription(`${map.zh}\n` +
                            `${map.en}\n` +
                            `${map.jp}\n`)
            .setThumbnail(`${this.imgUrlBase}${map.img}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        _interaction.reply({ embeds: [mapEmbed] })
    }
}

module.exports = CmdRandomMap
