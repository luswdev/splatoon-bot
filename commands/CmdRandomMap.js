'use strict'

const { EmbedBuilder } = require('discord.js')
const CmdBase = require('commands/CmdBase.js')
const database = require('data/Database.js')

class CmdRandomMap extends CmdBase {

    constructor () {
        super('rm')

        this.imgUrlBase = 'https://raw.githubusercontent.com/luswdev/splatoon-bot/bot-v2/img/map/'
    }

    doCmd (_interaction) {
        const map = database.randomList(database.dataList['maps'])
        const lang = this.locale2Lang(_interaction.locale) ?? 'en'
        const reply = this.buildMessage(map, lang, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const map = database.getListObject(parseInt(_option.res), 'maps')
        const reply = this.buildMessage(map, _option.lang, _interaction)
        return reply
    }

    buildMessage (_map, _lang, _interaction) {
        const embed = new EmbedBuilder()
            .setColor(_map.color)
            .setTitle(`${this.cmdData.icon} ${database.getListObject('Random', 'labels')[_lang]} ${database.getListObject('Stage', 'labels')[_lang]}!`)
            .setDescription(`${_map[_lang]}`)
            .setThumbnail(`${this.imgUrlBase}${_map.img}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const row = this.buildLangSelect({res: database.getListIdx(_map, 'maps')}, _lang)

        return { embeds: [embed], components: [row] }
    }
}

module.exports = CmdRandomMap
