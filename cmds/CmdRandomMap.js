'use strict'

const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const CmdBase = require('./CmdBase.js')
const { randomMap, mapIdx, getMap } = require('../data/database.js')

class CmdRandomMap extends CmdBase {

    constructor () {
        super('rm', '隨機地圖 Random pick a map')

        this.randomMap = randomMap
        this.imgUrlBase = 'https://raw.githubusercontent.com/luswdev/splatoon-bot/bot-v2/img/map/'
    }

    doCmd (_interaction) {
        const map = this.randomMap()
        const reply = this.buildMessage(map, 'en', _interaction)

        this.mysql.saveResult(this.cmdKey, map.en, _interaction.user.id)

        _interaction.reply(reply)
    }

    updateLang (_option, _interaction) {
        const map = getMap(_option.res)
        const reply = this.buildMessage(map, _option.lang, _interaction)
        _interaction.update(reply)
    }

    buildMessage (_map, _lang, _interaction) {
        const embed = new EmbedBuilder()
            .setColor(_map.color)
            .setTitle(':map: Random Map!')
            .setDescription(`${_map[_lang]}`)
            .setThumbnail(`${this.imgUrlBase}${_map.img}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const row = new ActionRowBuilder()
        const selected = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Choose Language')

        this.langs.forEach( (e) => {
            selected.addOptions([
                new StringSelectMenuOptionBuilder()
                    .setDefault(e.key === _lang)
                    .setEmoji(e.emoji)
                    .setDescription(e.name)
                    .setLabel(e.name)
                    .setValue(`{"lang": "${e.key}", "cmd": "${this.cmdKey}", "res": "${mapIdx(_map)}"}`),
            ])
        })

        row.addComponents(selected)

        return { embeds: [embed], components: [row] }
    }
}

module.exports = CmdRandomMap
