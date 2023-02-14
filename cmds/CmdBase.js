'use strict'

const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

const ConnDB = require('../pkg/ConnDB.js')
const { db } = require('../config.json')

const { cmds } = require('./cmds.json');

class CmdBase {

    constructor (_key = '', _options = undefined) {
        let cmd = cmds.find( (e) => e.value === _key)

        this.cmdKey = cmd.value
        this.cmdInfo = cmd.info
        this.infoUrlBase = 'https://splatoonwiki.org/wiki/'

        this.mysql = new ConnDB(db)

        this.langs = [
            { emoji: '🇹🇼', name: '正體中文', key: 'zhTW' },
            { emoji: '🇨🇳', name: '简体中文', key: 'zhCN' },
            { emoji: '🇯🇵', name: '日本語', key: 'ja' },
            { emoji: '🇰🇷', name: '한국어', key: 'ko' },
            { emoji: '🇺🇸', name: 'English', key: 'en' },
            { emoji: '🇩🇪', name: 'Deutsch', key: 'de' },
            { emoji: '🇪🇸', name: 'Español (ES)', key: 'esE' },
            { emoji: '🇲🇽', name: 'Español (MX)', key: 'esA' },
            { emoji: '🇫🇷', name: 'Français (FR)', key: 'frE' },
            { emoji: '🇨🇦', name: 'Français (CA)', key: 'frA' },
            { emoji: '🇮🇹', name: 'Italiano', key: 'it' },
            { emoji: '🇳🇱', name: 'Nederlands', key: 'nl' },
            { emoji: '🇷🇺', name: 'Русский', key: 'ru' },
        ]

        this.options = _options ?? cmd.options ?? []
        this.cmdData = cmd
    }

    locale2Lang (_locale) {
        const localeTable = [
            { locale: 'da', key: 'en' },
            { locale: 'de', key: 'de' },
            { locale: 'en-GB', key: 'en' },
            { locale: 'en-US', key: 'en' },
            { locale: 'es-ES', key: 'esE' },
            { locale: 'fr', key: 'frE' },
            { locale: 'hr', key: 'en' },
            { locale: 'it', key: 'it' },
            { locale: 'lt', key: 'en' },
            { locale: 'hu', key: 'en' },
            { locale: 'nl', key: 'nl' },
            { locale: 'no', key: 'en' },
            { locale: 'pl', key: 'en' },
            { locale: 'pt-BR', key: 'en' },
            { locale: 'ro', key: 'en' },
            { locale: 'fi', key: 'en' },
            { locale: 'sv-SE', key: 'en' },
            { locale: 'vi', key: 'en' },
            { locale: 'tr', key: 'en' },
            { locale: 'cs', key: 'en' },
            { locale: 'el', key: 'en' },
            { locale: 'bg', key: 'en' },
            { locale: 'ru', key: 'ru' },
            { locale: 'uk', key: 'en' },
            { locale: 'hi', key: 'en' },
            { locale: 'th', key: 'en' },
            { locale: 'zh-CN', key: 'zhCN' },
            { locale: 'ja', key: 'ja' },
            { locale: 'zh-TW', key: 'zhTW' },
            { locale: 'ko', key: 'ko' },
        ]

        return localeTable.filter( (entry) => { return entry.locale === _locale })[0].key
    }

    buildLangSelect (_otherVal, _curLang) {
        const row = new ActionRowBuilder()
        const selected = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Choose Language')

        for (let lang of this.langs) {
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
