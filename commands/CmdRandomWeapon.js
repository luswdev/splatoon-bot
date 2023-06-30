'use strict'

const { EmbedBuilder } = require('discord.js')
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
        const reply = this.buildMessage(weapon, lang, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const weapon = parseInt(_option.res)
        const reply = this.buildMessage(weapon, _option.lang, _interaction)
        return reply
    }

    buildMessage (_weapon, _lang, _interaction) {
        const weapon = database.getListObject(this.dataCategory, this.weaponList[_weapon])
        const thumb = findImg('weapon', this.weaponList[_weapon])
        const embed = new EmbedBuilder()
            .setColor(weapon.color)
            .setTitle(`${this.cmdData.icon} ${database.getListObject('Label', 'Random')[_lang]} ${database.getListObject('Label', 'Weapon')[_lang]}!`)
            .setDescription(`${weapon[_lang]}`)
            .setThumbnail(`attachment://${basename(thumb)}`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const row = this.buildLangSelect({res: _weapon}, _lang)

        return { embeds: [embed], components: [row], files: [thumb] }
    }
}

module.exports = CmdRandomWeapon
