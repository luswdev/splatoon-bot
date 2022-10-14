'use strict'

const CmdBase = require('./CmdBase.js')

class CmdRandomMap extends CmdBase {

    constructor () {
        super('rm', 'Random pick a map')
    }

    doCmd (_interaction) {
        _interaction.reply(`${this.cmdKey} building`)
    }
}

module.exports = CmdRandomMap
