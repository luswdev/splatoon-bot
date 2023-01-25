'use strict'

const { SlashCommandBuilder } = require('discord.js')

const CmdRandomWeapon = require('./CmdRandomWeapon.js')
const CmdRandomMap = require('./CmdRandomMap.js')
const CmdBotInfo = require('./CmdBotInfo.js')

const { log } = require('../pkg/log.js')

class CmdList {

    constructor () {
        this.cmds = []
        this.cmdsBuilder = []
    }

    installCmd (_cmd) {
        log.write(`installing command: ${_cmd.cmdKey}`)
        this.cmds.push(_cmd)
        this.cmdsBuilder.push(
            new SlashCommandBuilder()
                .setName(_cmd.cmdKey)
                .setDescription(_cmd.cmdInfo)
        )
    }

    parseCmd (_cmdName, _interaction, _client) {
        this.cmds.forEach( (cmd) => {
            if (_cmdName == cmd.cmdKey) {
                log.write(`inner command: ${cmd.cmdKey}`)
                return cmd.doCmd(_interaction, _client)
            }
        })
    }

    parseSelect(_selected, _interaction) {
        log.write(`option: ${_selected.lang}`)

        this.cmds.forEach( (cmd) => {
            if (_selected.cmd == cmd.cmdKey) {
                log.write(`inner command: ${cmd.cmdKey}`)
                return cmd.updateLang(_selected, _interaction)
            }
        })
    }
}

const cmdRw = new CmdRandomWeapon()
const cmdRm = new CmdRandomMap()
const cmdInfo = new CmdBotInfo()

const cmds = new CmdList()

cmds.installCmd(cmdRw)
cmds.installCmd(cmdRm)
cmds.installCmd(cmdInfo)

module.exports.parseCmd = (_cmdName, _interaction, _client) => {
    cmds.parseCmd(_cmdName, _interaction, _client)
}

module.exports.parseSelect = (_selected, _interaction) => {
    cmds.parseSelect(_selected, _interaction)
}

module.exports.getCmdsJson = () => {
    return cmds.cmdsBuilder.map(command => command.toJSON())
}