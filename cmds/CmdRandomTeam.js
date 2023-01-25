'use strict'

const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const _ = require('lodash');

const CmdBase = require('./CmdBase.js')
const { randomWeapon, getWeapon, weaponIdx } = require('../data/database.js')
const { log } = require('../pkg/log.js')

class CmdRandomTeam extends CmdBase {

    constructor () {
        super('rt', '隨機私房武器組 Random pick full teams of weapons in Private Battle')

        this.randomWeapon = randomWeapon
        this.imgUrlBase = 'https://leanny.github.io/splat3/images/weapon_flat/'
    }

    doCmd (_interaction) {
        const weapons = _.times(8, () => this.randomWeapon())
        const reply = this.buildMessage(weapons, 'en', _interaction)
        _interaction.reply(reply)
    }

    updateLang (_option, _interaction) {
        const weapons = _.times(8, (i) => getWeapon(_option.res[i]))
        const reply = this.buildMessage(weapons, _option.lang, _interaction)
        _interaction.update(reply)
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
                .setThumbnail("https://cdn.wikimg.net/en/splatoonwiki/images/6/60/Mode_Icon_Private_Battle_2.png")
                .setTimestamp()
        }

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
                    .setValue(`{"lang": "${e.key}", "cmd": "${this.cmdKey}", "res": ["${weaponIdx(_weapons[0])}", "${weaponIdx(_weapons[1])}", "${weaponIdx(_weapons[2])}", "${weaponIdx(_weapons[3])}", "${weaponIdx(_weapons[4])}", "${weaponIdx(_weapons[5])}", "${weaponIdx(_weapons[6])}", "${weaponIdx(_weapons[7])}"]}`),
            ])
        })

        row.addComponents(selected)

        return { embeds: embeds, components: [row] }
    }
}

module.exports = CmdRandomTeam
