'use strict'

const CmdBase = require('./CmdBase.js')

class CmdBotInfo extends CmdBase {

    constructor () {
        super('info', 'Bot information')
    }

    doCmd (_interaction) {
        _interaction.reply(`${this.cmdKey} building`)
    }
}

module.exports = CmdBotInfo
