'use strict'

const EvtBase = require('events/EvtBase')

const { db } = require('config.json')
const ConnDB = require('utils/ConnDB.js')
const { log } = require('utils/Log.js')

const mysql = new ConnDB(db)

class EvtInteractionCreate extends EvtBase {

    constructor () {
        super('interactionCreate')
    }

    async eventCallback (_client, _interaction) {
        log.write('get interaction from:', _interaction.user.username)

        let command = ''
        let reply = undefined
        if (_interaction.isChatInputCommand()) {
            command  = _interaction.commandName

            log.write('parsing command:', command)
            mysql.saveInteraction(command, _interaction.user.id, _interaction.type)

            await _interaction.deferReply()

            reply = _client.cmdList.parseCmd(command, _interaction, _client)
        } else if (_interaction.isStringSelectMenu()) {
            const selected = JSON.parse(_interaction.values[0])
            command = selected.cmd

            log.write('parsing select:', selected)
            mysql.saveInteraction(command, _interaction.user.id, _interaction.type)

            if (selected.cmd === 'help') {
                await _interaction.deferReply( { ephemeral: true } )
            } else {
                await _interaction.deferUpdate()
            }

            reply = _client.cmdList.parseSelect(selected, _interaction, _client)
        } else {
            log.write('unhandled interaction:', _interaction.type)
            return
        }

        await _interaction.editReply(reply)
        log.write('end of', command)
    }
}

module.exports = EvtInteractionCreate
