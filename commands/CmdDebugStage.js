'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { basename } = require('path')

const CmdBase = require('commands/CmdBase.js')
const database = require('utils/Database.js')
const { findImg } = require('utils/ImgFinder.js')

class CmdDebugWeapon extends CmdBase {

    constructor () {
        super('xrm')

        this.dataCategory = 'VSStage'
        this.stageList = Object.keys(database.dataList['en-US'][this.dataCategory])
    }

    doCmd (_interaction) {
        const start = 0
        const reply = this.buildMessage(start, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const start = parseInt(_option.res)
        const reply = this.buildMessage(start, _interaction)
        return reply
    }

    doButton (_btn, _interaction) {
        const dir = _btn.act === 'next'
        const cur = parseInt(_btn.res)
        const start = dir ? cur + 1 : cur - 1
        const reply = this.buildMessage(start, _interaction)
        return reply
    }

    buildMessage (_start, _interaction) {
        const stage = database.getListObject(this.dataCategory, this.stageList[_start])
        const thumb = findImg('stage', this.stageList[_start])
        const embed = new EmbedBuilder()
            .setColor(stage.color)
            .setTitle(`${this.stageList[_start]} (${_start + 1}/${this.stageList.length})`)
            .setDescription(
                `- ${stage['en-US']}\n` + `- ${stage['en-GB']}\n` +
                `- ${stage['es-MX']}\n` + `- ${stage['es-ES']}\n` +
                `- ${stage['fr']}\n`    + `- ${stage['fr-CA']}\n` +
                `- ${stage['de']}\n`    + `- ${stage['it']}\n` +
                `- ${stage['nl']}\n`    + `- ${stage['ru']}\n` +
                `- ${stage['zh-CN']}\n` + `- ${stage['zh-TW']}\n`
            )
            .setImage(`attachment://${basename(thumb)}`)
            .setFooter({ text: `/${this.cmdKey} (${_interaction.user.username})`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const btnNext = {cmd: this.cmdKey, act: 'next', res: _start}
        const btnPrev = {cmd: this.cmdKey, act: 'prev', res: _start}
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
                .setDisabled(_start === (this.stageList.length - 1)),
            )

        return { embeds: [embed], components: [pager], files: [thumb] }
    }
}

module.exports = CmdDebugWeapon
