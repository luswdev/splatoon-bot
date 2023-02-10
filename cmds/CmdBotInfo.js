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

        let help = cmds.find( (e) => e.value === 'help')
        super(help.value, help.info, [{ type: 'string', name: 'command', info: '要查詢的指令 Which command?', choices: choices }])

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
                isCmd = true

                let description = ''
                for (let line of cmd.details[_lang]) {
                    description += `- ${line}\n`
                }

                let args = ''
                for (let arg of cmd.arguments) {
                    args += `${arg} `
                }
                args = args.substring(0, args.length - 1)
                let usage = cmd.arguments.length ? `[${args}]` : ''

                let examples = ''
                for (let i = 0; i < cmd.examples.length; ++i) {
                    examples += `${i + 1}. ${cmd.examples[i][_lang].info}\n`
                    examples += `\`\`\`${cmd.examples[i][_lang].cmd} \`\`\`\n`
                }

                infoEmbed.setTitle(`${cmd.icon} | ${cmd.value}`)
                    .setDescription(description)
                    .addFields(
                        { name: `${_lang == 'zh' ? '用法' : 'Usage'}`, value: `\`\`\`/${cmd.value} ${usage}\`\`\`` },
                        { name: `${_lang == 'zh' ? '範例' : 'Example'}`, value: `${examples}` },
                        { name: `${_lang == 'zh' ? '試一下' : 'Try It'}`, value: `</${cmd.value}:${cmd.raw}>` },
                    )
                break;
            }
        }

        if (!isCmd) {
            let description = ''
            if (_lang == 'zh') {
                description += `專門為斯普拉遁 3 的機器人啦\n`
                description += `去看看：${this.homeURL}\n\n`
                description += `:arrow_down: 查看更多指令說明`
            } else {
                description += `A simple bot for Splatoon 3\n`
                description += `Visit website: ${this.homeURL}\n\n`
                description += `:arrow_down: For more command information`
            }
 s
            infoEmbed.setTitle(':information_source: | Help Manual')
                .setDescription(description)
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
