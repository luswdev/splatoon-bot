'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { basename } = require('path')

const CmdBase = require('commands/CmdBase.js')
const database = require('utils/Database.js')
const Random = require('utils/Random.js')
const { findImg } = require('utils/ImgFinder.js')

class CmdRandomWeapon extends CmdBase {

    constructor () {
        super('rw')

        this.dataCategory = 'MainWeapon'
        this.random = new Random()
        this.weaponList = Object.keys(database.dataList['en-US'][this.dataCategory])
    }

    randomList() {
        const randIdx = this.random.getRandomRange(this.weaponList.length)
        return randIdx
    }

    doCmd (_interaction) {
        this.random.initRandom()
        const weapon = this.randomList()
        const lang = this.locale2Lang(_interaction.locale) ?? 'en-US'
        const reply = this.buildMessage(weapon, lang, 1, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const weapon = parseInt(_option.res)
        const cnt = parseInt(_option.cnt) ?? 1
        const reply = this.buildMessage(weapon, _option.lang, cnt, _interaction)
        return reply
    }

    doButton (_btn, _interaction) {
        this.random.initRandom()
        const weapon = this.randomList()
        const lang = _btn.lang ?? 'en-US'
        const cnt = _btn.cnt ?? 2
        const reply = this.buildMessage(weapon, lang, cnt, _interaction)
        return reply
    }

    buildMessage (_weapon, _lang, _cnt, _interaction) {
        const weapon = database.getListObject(this.dataCategory, this.weaponList[_weapon])
        const thumb = findImg('weapon', this.weaponList[_weapon])
        const embed = new EmbedBuilder()
            .setColor(weapon.color)
            .setTitle(`${this.cmdData.icon} ${database.getListObject('Label', 'Random')[_lang]} ${database.getListObject('Label', 'Weapon')[_lang]}!`)
            .setDescription(`${weapon[_lang]}`)
            .setThumbnail(`attachment://${basename(thumb)}`)
            .setFooter({ text: `/${this.cmdKey}.${_cnt} (${_interaction.user.username})`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const langSelect = this.buildLangSelect({res: _weapon, cnt: _cnt}, _lang)

        const btn = {cmd: 'rw', act: 'redo', cnt: _cnt + 1, lang: _lang}
        const retry = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setCustomId(JSON.stringify(btn))
                .setEmoji(database.getListObject('Label', 'Redo')['icon'])
                .setLabel(database.getListObject('Label', 'Redo')[_lang])
                .setStyle(ButtonStyle.Success),
            )

        return { embeds: [embed], components: [langSelect, retry], files: [thumb] }
    }
}

module.exports = CmdRandomWeapon
