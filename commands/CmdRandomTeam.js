'use strict'

const { EmbedBuilder } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')
const database = require('data/Database.js')

class CmdRandomTeam extends CmdBase {

    constructor () {
        super('rt')

        this.imgUrlBase = 'https://leanny.github.io/splat3/images/weapon_flat/'
    }

    doCmd (_interaction) {
        database.initRandom()
        const weapons = Array.apply(null, Array(8)).map( () => database.randomList(database.dataList['weapons']))
        const lang = this.locale2Lang(_interaction.locale) ?? 'en'
        const reply = this.buildMessage(weapons, lang, _interaction)
        return reply
    }

    doSelect (_option, _interaction) {
        const weapons = _option.res.map( (e) => database.getListObject(e, 'weapons'))
        const reply = this.buildMessage(weapons, _option.lang, _interaction)
        return reply
    }

    buildMessage (_weapons, _lang, _interaction) {
        let embeds = []
        for (let i = 0; i < 2; ++i) {
            embeds.push(new EmbedBuilder())

            embeds[i]
                .setColor(i & 0x01 ? 0x4b25c9 : 0xdacd12)
                .setTitle(`${i & 0x01 ? ':blue_circle:' : ':yellow_circle:'} ${i & 0x01 ? 'Bravo' : 'Alpha'} Team`)
                .setDescription(`${_weapons[0 + i * 4].icon} ${_weapons[0 + i * 4][_lang]}\n` +
                                `${_weapons[1 + i * 4].icon} ${_weapons[1 + i * 4][_lang]}\n` +
                                `${_weapons[2 + i * 4].icon} ${_weapons[2 + i * 4][_lang]}\n` +
                                `${_weapons[3 + i * 4].icon} ${_weapons[3 + i * 4][_lang]}`)
                .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
                .setThumbnail(this.cmdData.thumbnail)
                .setTimestamp()
        }

        let val = { res: [] }
        for (let weapon of _weapons) {
            val.res.push(database.getListIdx(weapon, 'weapons'))
        }
        const row = this.buildLangSelect(val, _lang)

        return { embeds: embeds, components: [row] }
    }
}

module.exports = CmdRandomTeam
