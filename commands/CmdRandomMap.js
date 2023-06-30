'use strict'

const { EmbedBuilder } = require('discord.js')
const { basename } = require('path')

const CmdBase = require('commands/CmdBase.js')
const database = require('utils/Database.js')
const Random = require('utils/Random.js')
const { findImg } = require('utils/ImgFinder.js')

class CmdRandomMap extends CmdBase {

    constructor () {
        super('rm')

        this.dataCategory = 'VSStage'
        this.random = new Random()
        this.stageList = Object.keys(database.dataList['en-US'][this.dataCategory])
    }

    randomList() {
        const randIdx = this.random.getRandomRange(this.stageList.length)
        return randIdx
    }

    doCmd (_interaction) {
        this.random.initRandom()
        const map = this.randomList()
        const lang = this.locale2Lang(_interaction.locale) ?? 'en-US'
        const reply = this.buildMessage(map, lang, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const map = parseInt(_option.res)
        const reply = this.buildMessage(map, _option.lang, _interaction)
        return reply
    }

    buildMessage (_map, _lang, _interaction) {
        const map = database.getListObject(this.dataCategory, this.stageList[_map])
        const thumb = findImg('stage', this.stageList[_map])
        const embed = new EmbedBuilder()
            .setColor(map.color)
            .setTitle(`${this.cmdData.icon} ${database.getListObject('Label', 'Random')[_lang]} ${database.getListObject('Label', 'Stage')[_lang]}!`)
            .setDescription(map[_lang])
            .setImage(`attachment://${basename(thumb)}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const row = this.buildLangSelect({res: _map}, _lang)

        return { embeds: [embed], components: [row], files: [thumb] }
    }
}

module.exports = CmdRandomMap
