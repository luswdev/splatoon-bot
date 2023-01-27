'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { version } = require('../package.json');

const CmdBase = require('./CmdBase.js')

class CmdBotInfo extends CmdBase {

    constructor () {
        super('help', '指令幫助 Bot information')
    }

    doCmd (_interaction, _client) {
        const infoEmbed = new EmbedBuilder()
            .setColor(0xB3FDDF)
            .setThumbnail(_client.user.displayAvatarURL())
            .setTitle(':information_source: Help Manual')
            .setDescription(`專門為斯普拉遁 3 的機器人啦\n` +
                            `A simple bot for Splatoon 3\n` +
                            `Visit website: https://lusw.dev/splatoon`)
            .addFields(
                { name: '/rw', value: '隨機武器！\nRandom pick a weapon!\ntry it: </rw:1068585446088642612>', inline: true },
                { name: '/rm', value: '隨機地圖！\nRandom pick a map!\ntry it: </rm:1068585605602230323>', inline: true },
                { name: '/rt', value: '隨機私房武器組\nRandom pick full teams of weapons in Private Battle!\ntry it: </rt:1068585665610125422>', inline: true },
                { name: '/rot', value: '查看現在的地圖\nGet current maps rotation!\ntry it: </rot:1068530389884358726>', inline: true },
                { name: 'Version', value: version },
            )
            .setFooter({ text: `${_client.user.username} | A simple bot for Splatoon 3`, iconURL: _client.user.displayAvatarURL() })

        const row = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL('https://lusw.dev/splatoon')
                .setLabel('Information')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:splatoonbot:1042279520759185478>'),
            )

        _interaction.reply({ embeds: [infoEmbed], components: [row] })
    }
}

module.exports = CmdBotInfo
