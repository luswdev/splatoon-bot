'use strict'

const { EmbedBuilder } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')
const database = require('utils/Database.js')
const Random = require('utils/Random.js')

class CmdRandomTeam extends CmdBase {

    constructor () {
        super('rt')

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
        const weapons = Array.apply(null, Array(8)).map( () => this.randomList())
        const lang = this.locale2Lang(_interaction.locale) ?? 'en-US'
        const reply = this.buildMessage(weapons, lang, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const weapons = _option.res
        const reply = this.buildMessage(weapons, _option.lang, _interaction)
        return reply
    }

    buildMessage (_weapons, _lang, _interaction) {
        let weapons = _weapons.map( (e) => {
            const weaponKey = this.weaponList[e]
            return database.getListObject(this.dataCategory, weaponKey)
        })

        let embeds = []
        for (let i = 0; i < 2; ++i) {
            embeds.push(new EmbedBuilder())

            embeds[i]
                .setColor(i & 0x01 ? 0x4b25c9 : 0xdacd12)
                .setTitle(`${i & 0x01 ? ':blue_circle:' : ':yellow_circle:'} ${i & 0x01 ? 'Bravo' : 'Alpha'} Team`)
                .setDescription(`${weapons[0 + i * 4].icon} ${weapons[0 + i * 4][_lang]}\n` +
                                `${weapons[1 + i * 4].icon} ${weapons[1 + i * 4][_lang]}\n` +
                                `${weapons[2 + i * 4].icon} ${weapons[2 + i * 4][_lang]}\n` +
                                `${weapons[3 + i * 4].icon} ${weapons[3 + i * 4][_lang]}`)
                .setFooter({ text: `/${this.cmdKey} (${_interaction.user.username})`, iconURL: _interaction.user.avatarURL()})
                .setThumbnail(this.cmdData.thumbnail)
                .setTimestamp()
        }

        const row = this.buildLangSelect({res: _weapons}, _lang)

        return { embeds: embeds, components: [row] }
    }
}

module.exports = CmdRandomTeam
