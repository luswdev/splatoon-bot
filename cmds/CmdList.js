'use strict'

const { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption } = require('discord.js')

const CmdRandomWeapon = require('./CmdRandomWeapon.js')
const CmdRandomMap = require('./CmdRandomMap.js')
const CmdRandomTeam = require('./CmdRandomTeam.js')
const CmdRotation = require('./CmdRotation.js')
const CmdBotInfo = require('./CmdBotInfo.js')
const CmdSalmonRun = require('./CmdSalmonRun.js')

const { log } = require('../pkg/Log.js')

class CmdList {

    constructor () {
        this.cmds = []
        this.cmdsBuilder = []
    }

    installCmd (_cmd) {
        log.write(`installing command: ${_cmd.cmdKey}`)
        this.cmds.push(_cmd)

        const scb = new SlashCommandBuilder()
            .setName(_cmd.cmdKey)
            .setDescription(_cmd.cmdInfo)

        _cmd.options.forEach( (opt) => {
            if (opt.type == 'integer') {
                scb.addIntegerOption(new SlashCommandIntegerOption()
                        .setName(opt.name)
                        .setDescription(opt.info)
                        .setAutocomplete(true)
                        .setMinValue(opt.min)
                        .setMaxValue(opt.max))
            } else if (opt.type == 'string') {
                let strOption = new SlashCommandStringOption()
                strOption.setName(opt.name)
                    .setDescription(opt.info)

                for (let choice of opt.choices) {
                    strOption.addChoices(choice)
                }
                scb.addStringOption(strOption);
            }
        })

        this.cmdsBuilder.push(scb)
    }

    parseCmd (_cmdName, _interaction, _client) {
        for (let cmd of this.cmds) {
            if (_cmdName == cmd.cmdKey) {
                log.write(`inner command: ${cmd.cmdKey}`)
                return cmd.doCmd(_interaction, _client)
            }
        }
    }

    parseSelect(_selected, _interaction, _client) {
        for (let cmd of this.cmds) {
            if (_selected.cmd == cmd.cmdKey) {
                log.write(`inner command: ${cmd.cmdKey}`)
                return cmd.doSelect(_selected, _interaction, _client)
            }
        }
    }
}

const cmdRw = new CmdRandomWeapon()
const cmdRm = new CmdRandomMap()
const cmdRt = new CmdRandomTeam()
const cmdRot = new CmdRotation()
const cmdSr = new CmdSalmonRun()
const cmdInfo = new CmdBotInfo()

const cmds = new CmdList()

cmds.installCmd(cmdRw)
cmds.installCmd(cmdRm)
cmds.installCmd(cmdRt)
cmds.installCmd(cmdRot)
cmds.installCmd(cmdSr)
cmds.installCmd(cmdInfo)

module.exports.parseCmd = (_cmdName, _interaction, _client) => {
    let reply = cmds.parseCmd(_cmdName, _interaction, _client)
    return reply
}

module.exports.parseSelect = (_selected, _interaction, _client) => {
    return cmds.parseSelect(_selected, _interaction, _client)
}

module.exports.getCmdsJson = () => {
    return cmds.cmdsBuilder.map(command => command.toJSON())
}
