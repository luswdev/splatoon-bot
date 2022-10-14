'use strict'

const { EmbedBuilder } = require('discord.js');
const CmdBase = require('./CmdBase.js')

class CmdBotInfo extends CmdBase {

    constructor () {
        super('help', 'Bot information')
    }

    doCmd (_interaction) {
        const infoEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Help Manual')
            .setDescription(`A sample bot for Splatoon 3\n` +
                            `Visit website: https://lusw.dev/splatoon`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL() })
            .setTimestamp()

        _interaction.reply({ embeds: [infoEmbed] })
    }
}

module.exports = CmdBotInfo
