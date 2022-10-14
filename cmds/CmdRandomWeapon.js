'use strict'

const CmdBase = require('./CmdBase.js')

class CmdRandomWeapon extends CmdBase {

    constructor () {
        super('rw', 'Random pick a weapon')
    }

    doCmd (_interaction) {
        _interaction.reply(`${this.cmdKey} building`)
    }
}

module.exports = CmdRandomWeapon
