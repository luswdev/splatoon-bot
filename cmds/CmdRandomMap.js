'use strict'

const { EmbedBuilder } = require('discord.js')
const CmdBase = require('./CmdBase.js')
const { randomMap, mapIdx, getMap } = require('../data/Database.js')

class CmdRandomMap extends CmdBase {

    constructor () {
        super('rm')

        this.randomMap = randomMap
        this.imgUrlBase = 'https://raw.githubusercontent.com/luswdev/splatoon-bot/bot-v2/img/map/'
    }

    async doCmd (_interaction) {
        const map = this.randomMap()
        const lang = this.locale2Lang(_interaction.locale) ?? 'en'
        const reply = this.buildMessage(map, lang, _interaction)

        this.mysql.saveResult(this.cmdKey, map.en, _interaction.user.id)

        await _interaction.reply(reply)
    }

    async doSelect (_option, _interaction) {
        const map = getMap(parseInt(_option.res))
        const reply = this.buildMessage(map, _option.lang, _interaction)
        await _interaction.update(reply)
    }

    buildMessage (_map, _lang, _interaction) {
        const embed = new EmbedBuilder()
            .setColor(_map.color)
            .setTitle(`${this.cmdData.icon} Random Map!`)
            .setDescription(`${_map[_lang]}`)
            .setThumbnail(`${this.imgUrlBase}${_map.img}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const row = this.buildLangSelect({res: mapIdx(_map)}, _lang)

        return { embeds: [embed], components: [row] }
    }
}

module.exports = CmdRandomMap
