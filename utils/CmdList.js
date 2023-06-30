'use strict'

const { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption } = require('discord.js')

const { log } = require('utils/Log.js')

class CmdList {

    constructor () {
        this.cmds = []
        this.cmdsBuilder = []
    }

    installCmd (_cmd) {
        log.write('installing command:', _cmd.cmdKey)
        this.cmds.push(_cmd)

        const scb = new SlashCommandBuilder()
            .setName(_cmd.cmdKey)
            .setDescription(_cmd.cmdInfo)

        for (let opt of _cmd.options) {
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
                scb.addStringOption(strOption)
            }
        }

        this.cmdsBuilder.push(scb)
    }

    parseCmd (_cmdName, _interaction, _client) {
        for (let cmd of this.cmds) {
            if (_cmdName == cmd.cmdKey) {
                log.write('inner command:', cmd.cmdKey)
                return cmd.doCmd(_interaction, _client)
            }
        }
    }

    parseSelect(_selected, _interaction, _client) {
        for (let cmd of this.cmds) {
            if (_selected.cmd == cmd.cmdKey) {
                log.write('inner command:', cmd.cmdKey)
                return cmd.doSelect(_selected, _interaction, _client)
            }
        }
    }

    parseButton(_cmdName, _interaction, _client) {
        for (let cmd of this.cmds) {
            if (_cmdName == cmd.cmdKey) {
                log.write('inner command:', cmd.cmdKey)
                return cmd.doButton(_interaction, _client)
            }
        }
    }
}

module.exports = CmdList
