'use strict'

const { EmbedBuilder } = require('discord.js');
const CmdBase = require('./CmdBase.js')
const mapList = require('../data/map.js')

class CmdRandomMap extends CmdBase {

    constructor () {
        super('rm', 'Random pick a map')
    }

    doCmd (_interaction) {
        console.log(Object.values(mapList.zh)[1])
        const mapEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Random Map!!')
            .setDescription(`${Object.values(mapList.zh)[1]}[\n` +
                            `${Object.values(mapList.en)[1]}[\n` +
                            `${Object.values(mapList.jp)[1]}[\n`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: `${this.imgUrlBase}${Object.values(mapList.img)[1]}` })
            .setTimestamp()

        _interaction.reply({ embeds: [mapEmbed] })
    }
}

module.exports = CmdRandomMap
