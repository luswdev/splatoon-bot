'use strict'

const { EmbedBuilder } = require('discord.js');
const { version } = require('../package.json');

const CmdBase = require('./CmdBase.js')

class CmdBotInfo extends CmdBase {

    constructor () {
        super('help', 'Bot information')
    }

    doCmd (_interaction, _client) {
        const infoEmbed = new EmbedBuilder()
            .setColor(0xB3FDDF)
            .setThumbnail('https://github.com/luswdev/splatoon-bot/blob/doc-page/img/bot-icon.png?raw=true')
            .setTitle(':information_source: Help Manual')
            .setURL('https://lusw.dev/splatoon')
            .setDescription(`A sample bot for Splatoon 3\n` +
                            `Visit website: https://lusw.dev/splatoon`)
            .addFields(
                { name: '/rw', value: 'Random Weapon', inline: true },
                { name: '/rm', value: 'Random Map', inline: true },
                { name: 'Version', value: version },
            )
            .setFooter({ text: `${_client.user.username} | A sample bot for Splatoon 3`, iconURL: _client.user.displayAvatarURL() })

        _interaction.reply({ embeds: [infoEmbed] })
    }
}

module.exports = CmdBotInfo
