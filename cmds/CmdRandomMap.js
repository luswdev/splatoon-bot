'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CmdBase = require('./CmdBase.js')
const { randomMap } = require('../data/database.js')

class CmdRandomMap extends CmdBase {

    constructor () {
        super('rm', '隨機地圖 Random pick a map')

        this.randomMap = randomMap
        this.imgUrlBase = 'https://raw.githubusercontent.com/luswdev/splatoon-bot/bot-v2/img/map/'
    }

    doCmd (_interaction) {
        const map = this.randomMap()
        const mapEmbed = new EmbedBuilder()
            .setColor(map.color)
            .setTitle(':map: Your random map')
            .addFields(
                { name: '場地', value: map.zh},
                { name: 'Stage', value: map.en},
                { name: 'ステージ', value: map.jp},
            )
            .setThumbnail(`${this.imgUrlBase}${map.img}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const row = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL(this.infoUrl(map.en))
                .setLabel('Inkipedia')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:Squid:1021583273828306974>'),
            )

        this.mysql.saveResult(this.cmdKey, map.en, _interaction.user.id)

        _interaction.reply({ embeds: [mapEmbed], components: [row] })
    }
}

module.exports = CmdRandomMap
