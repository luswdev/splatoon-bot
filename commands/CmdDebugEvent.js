'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')
const database = require('utils/Database.js')

class CmdDebugWeapon extends CmdBase {

    constructor () {
        super('xevt')

        this.dataCategory = 'EventMatch'
        this.eventList = Object.keys(database.dataList['en-US'][this.dataCategory])
    }

    doCmd (_interaction) {
        const start = 0
        const lang = this.locale2Lang(_interaction.locale) ?? 'en-US'
        const reply = this.buildMessage(start, lang, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const start = parseInt(_option.res)
        const reply = this.buildMessage(start, _option.lang, _interaction)
        return reply
    }

    doButton (_btn, _interaction) {
        const dir = _btn.act === 'next'
        const cur = parseInt(_btn.res)
        const start = dir ? cur + 1 : cur - 1
        const reply = this.buildMessage(start, _btn.lang, _interaction)
        return reply
    }

    buildMessage (_start, _lang, _interaction) {
        const match = database.getListObject('Match', 'League')
        const manual = database.getListObject('Label', 'Manual')
        const rule_main = database.getListObject(this.dataCategory, this.eventList[_start * 3 + 2])
        const rule_sub = database.getListObject(this.dataCategory, this.eventList[_start * 3 + 1])
        const rule_desc = database.getListObject(this.dataCategory, this.eventList[_start * 3])

        const embed = new EmbedBuilder()
            .setColor(match.color)
            .setTitle(`${match.icon} ${rule_main[_lang]}`)
            .setDescription(`**${rule_sub[_lang]}**`)
            .addFields(
                {
                    name: manual[_lang],
                    value: rule_desc[_lang],
                }
            )
            .setFooter({ text: `/${this.cmdKey} (${_interaction.user.username})`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const langSelect = this.buildLangSelect({res: _start}, _lang)

        const btnNext = {cmd: this.cmdKey, act: 'next', res: _start, lang: _lang}
        const btnPrev = {cmd: this.cmdKey, act: 'prev', res: _start, lang: _lang}
        const pager = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setCustomId(JSON.stringify(btnPrev))
                .setEmoji('<:leftarrow:1127627896094212206>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(_start === 0),
            )
            .addComponents( new ButtonBuilder()
                .setCustomId(JSON.stringify(btnNext))
                .setEmoji('<:rightarrow:1127627892692627598>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(_start === ((this.eventList.length / 3) - 1)),
            )

        return { embeds: [embed], components: [langSelect, pager] }
    }
}

module.exports = CmdDebugWeapon
