'use strict'

const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

const { cmds } = require('commands/cmds.json')
const i18n = require('commands/i18n.json')

class CmdBase {

    constructor (_key = '', _options = undefined) {
        let cmd = cmds.find( (e) => e.value === _key)

        this.cmdKey = cmd.value
        this.cmdInfo = cmd.info

        this.options = _options ?? cmd.options ?? []
        this.cmdData = cmd
    }

    locale2Lang (_locale) {
        return i18n.filter( (entry) => { return entry.locale.indexOf(_locale) !== -1 })[0].key
    }

    buildLangSelect (_otherVal, _curLang) {
        const row = new ActionRowBuilder()
        const selected = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Choose Language')

        for (let lang of i18n) {
            const baseVal = {
                lang: lang.key,
                cmd: this.cmdKey,
            }
            const val = {...baseVal, ..._otherVal}

            selected.addOptions([
                new StringSelectMenuOptionBuilder()
                    .setDefault(lang.key === _curLang)
                    .setEmoji(lang.emoji)
                    .setDescription(lang.name)
                    .setLabel(lang.name)
                    .setValue(JSON.stringify(val)),
            ])
        }
        row.addComponents(selected)

        return row
    }
}

module.exports = CmdBase
