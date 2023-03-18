'use strict'

const { EmbedBuilder } = require('discord.js')

class ErrorHandler {

    constructor (_client, _channel) {
        _client.channels.fetch(_channel).then( (ch) => this.channel = ch)
    }

    send (_err) {
        const trace = _err.stack
        const embed = new EmbedBuilder()
            .setColor(0xDC2626)
            .setTitle('❌ Error Catch')
            .setDescription(`\`\`\`${trace}\`\`\``)
            .setTimestamp()

        this.channel.send({ embeds: [embed] })
    }
}

module.exports = ErrorHandler
