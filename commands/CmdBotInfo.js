'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { version } = require('package.json')

const cmds = require('commands/cmds.json')
const CmdBase = require('commands/CmdBase.js')

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

    doCmd (_interaction, _client) {
        const cmd = _interaction.options.getString('command') ?? ''
        const lang = _interaction.locale.indexOf('zh') != -1 ? 'zh' : 'en'
        const reply = this.buildMessage(cmd, lang, _client)
        return reply
    }

    doSelect (_option, _interaction, _client) {
        const cmd = _option.res
        const lang = _interaction.locale.indexOf('zh') != -1 ? 'zh' : 'en'
        const reply = this.buildMessage(cmd, lang, _client)
        return reply
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
                let rawCmd = _client.commands.toJSON().find( (c) => c.name === cmd.value )
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

                if (cmd.thumbnail !== '') {
                    infoEmbed.setThumbnail(cmd.thumbnail)
                }
                break
            }
        }

        if (!isCmd) {
            const inviteURL = 'https://discord.gg/zkaGSn7Wtr'
            let description = ''
            let botInfo = ''
            if (_lang == 'zh') {
                description += `專門為斯普拉遁 3 的機器人啦\n\n`
                description += `<:dot:1073790424520601600> 請點擊下方選單查看個別指令說明，或至 [主頁](${this.homeURL}) 查看完整文件\n`
                description += `<:dot:1073790424520601600> 使用此機器人即表示你同意 [隱私權聲明](${this.homeURL}/privacy)\ `
                description += `及 [服務條款](${this.homeURL}/terms)\n`
                description += `<:dot:1073790424520601600> 有任何其他疑問，請至 [支援伺服器](${inviteURL}) 詢問開發者`

                botInfo += `\`${_client.botInfo.serverCnt.toLocaleString()}\` 個伺服器\n`
                botInfo += `\`${_client.botInfo.memberCnt.toLocaleString()}\` 個成員 \n`
            } else {
                description += `A simple bot for Splatoon 3\n\n`
                description += `<:dot:1073790424520601600> Please click select menu to see command information, or visit [Home Page](${this.homeURL}) to check out full document\n`
                description += `<:dot:1073790424520601600> By using this bot, we assume you agree our [Privacy Policy](${this.homeURL}/privacy)\ `
                description += `and [Terms of Service](${this.homeURL}/terms)\n`
                description += `<:dot:1073790424520601600> With others question, please ask to developer at [support server](${inviteURL})`

                botInfo += `\`${_client.botInfo.serverCnt.toLocaleString()}\` servers(s)\n`
                botInfo += `\`${_client.botInfo.memberCnt.toLocaleString()}\` member(s)\n`
            }

            infoEmbed.setDescription(description)
                .addFields(
                    { name: `📊 ${_lang == 'zh' ? '系統資訊' : 'System Information'}`, value: botInfo },
                    { name: `⚙ ${_lang == 'zh' ? '版本' : 'Version'}`, value: `${version} (<t:${Math.floor(_client.startTimestamp / 1000)}>)` },
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

        return { embeds: [infoEmbed], components: [list, row], ephemeral: isCmd }
    }
}

module.exports = CmdBotInfo
