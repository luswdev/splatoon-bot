'use strict'

const { EmbedBuilder } = require('discord.js');
const CmdBase = require('./CmdBase.js')
const mapList = require('../data/map.js')

class CmdRandomMap extends CmdBase {

    constructor () {
        super('rm', 'Random pick a map')
    }

    doCmd (_interaction) {
        console.log(`${this.imgUrlBase}${Object.values(mapList.img)[1]}`)
        const mapEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Random Map!!')
            .setDescription(`${Object.values(mapList.zh)[1]}\n` +
                            `${Object.values(mapList.en)[1]}\n` +
                            `${Object.values(mapList.jp)[1]}\n`)
            .setImage(`${this.imgUrlBase}${Object.values(mapList.img)[1]}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        _interaction.reply({ embeds: [mapEmbed] })
    }
}

module.exports = CmdRandomMap
