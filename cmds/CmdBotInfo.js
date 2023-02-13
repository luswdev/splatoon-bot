'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { version } = require('../package.json');
const { cmds } = require('./cmds.json');

const CmdBase = require('./CmdBase.js')

class CmdBotInfo extends CmdBase {

    constructor () {
        let choices = []
        for (let cmd of cmds) {
            choices.push({name: cmd.info, value: cmd.value})
        }

        super('help', [{ type: 'string', name: 'command', info: '要查詢的指令 Which command?', choices: choices }])

        this.choices = choices
        this.homeURL = 'https://lusw.dev/splatoon'
    }

    async doCmd (_interaction, _client) {
        const cmd = _interaction.options.getString('command') ?? ''
        const lang = _interaction.locale.indexOf('zh') != -1 ? 'zh' : 'en'
        const reply = this.buildMessage(cmd, lang, _client)
        await _interaction.reply(reply)
    }

    async doSelect (_option, _interaction, _client) {
        const cmd = _option.res
        const lang = _interaction.locale.indexOf('zh') != -1 ? 'zh' : 'en'
        const reply = this.buildMessage(cmd, lang, _client)
        await _interaction.reply(reply)
    }

    buildCmdSelect (_curCmd) {
        const row = new ActionRowBuilder()
        const selected = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('要查詢的指令 Which command?')

        for (let cmd of cmds) {
            const val = {
                cmd: this.cmdKey,
                res: cmd.value,
            }

            selected.addOptions([
                new StringSelectMenuOptionBuilder()
                    .setDefault(cmd.value === _curCmd)
                    .setDescription(cmd.info)
                    .setEmoji(cmd.icon)
                    .setLabel(cmd.value)
                    .setValue(JSON.stringify(val)),
            ])
        }
        row.addComponents(selected)

        return row
    }

    buildMessage (_cmd, _lang, _client) {
        let isCmd = false
        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: _client.user.username, iconURL: _client.user.displayAvatarURL(), url: this.homeURL})
            .setColor(0xB3FDDF)
            .setThumbnail(_client.user.displayAvatarURL())
            .setFooter({ text: `A simple bot for Splatoon 3`, iconURL: _client.user.displayAvatarURL() })

        for (let cmd of cmds) {
            if (cmd.value === _cmd) {
                let rawCmd = _client.commands.toJSON().find( (c) => c.name === cmd.value );
                isCmd = true

                let description = cmd.details[_lang].map( (line) => `<:dot:1073790424520601600> ${line}` ).join('\n')
                let usage = cmd.arguments.length ? `[${cmd.arguments.join(' ')}]` : ''
                let cmdID = `</${rawCmd.name}:${rawCmd.id}>`
                let examples = cmd.examples.map( (elem, i) => `${i + 1}. ${elem[_lang].info}\n` +
                                                `${elem[_lang].cmd.replace(rawCmd.name, cmdID)} \n`).join('\n')

                infoEmbed.setTitle(`${cmd.icon} | ${cmd.value}`)
                    .setDescription(description)
                    .addFields(
                        { name: `${_lang == 'zh' ? '用法' : 'Usage'}`, value: `\`\`\`/${cmd.value} ${usage}\`\`\`` },
                        { name: `${_lang == 'zh' ? '範例' : 'Example'}`, value: `${examples}` },
                    )
                break;
            }
        }

        if (!isCmd) {
            let description = ''
            if (_lang == 'zh') {
                description += `專門為斯普拉遁 3 的機器人啦\n`
                description += `去看看：${this.homeURL}`
            } else {
                description += `A simple bot for Splatoon 3\n`
                description += `Visit website: ${this.homeURL}`
            }

            infoEmbed.setTitle(':information_source: | Help Manual')
                .setDescription(description)
                .addFields(
                    { name: `${_lang == 'zh' ? '版本' : 'Version'}`, value: version },
                )
        }

        const row = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setURL(this.homeURL)
                .setLabel('Information')
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:splatoonbot:1042279520759185478>'),
            )

        const list = this.buildCmdSelect(_cmd)

        return { embeds: [infoEmbed], components: [list, row], ephemeral: isCmd}
    }
}

module.exports = CmdBotInfo
