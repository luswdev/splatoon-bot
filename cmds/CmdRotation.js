'use strict'

const { EmbedBuilder } = require('discord.js')
const axios = require('axios')
const { mkdirSync, writeFileSync } = require('fs')
const { createCanvas, loadImage } = require('canvas')

const CmdBase = require('./CmdBase.js')
const { getMap, getMode, getMatch } = require('../data/database.js')

class CmdRotation extends CmdBase {

    constructor () {
        super('rot', '查看現在的地圖 get current maps rotation', [{type: 'integer', name: 'rotation', info: '第幾輪模式 Which Rotation?', min: 0, max:11}])

        this.imgUrlBase = 'https://raw.githubusercontent.com/luswdev/splatoon-bot/bot-v2/img/map/'

        mkdirSync('/tmp/spl3/', { recursive: true });
        mkdirSync('/tmp/spl3/img', { recursive: true });
    }

    async doCmd (_interaction) {
        const rotation = _interaction.options.getInteger('rotation') ?? 0

        await _interaction.deferReply()

        const reply = await this.buildMessage('en', rotation, _interaction)
        _interaction.editReply(reply)
    }

    async updateLang (_option, _interaction) {
        const rotation = _option.rotation

        await _interaction.deferUpdate()

        const reply = await this.buildMessage(_option.lang, rotation, _interaction)
        _interaction.editReply(reply)
    }

    async fetchRotation (_rotation) {
        try {
            const res = await axios.get('https://splatoon3.ink/data/schedules.json')
            const resJson = res.data

            const regular_map = []
            const anarchy_challenge_map = []
            const anarchy_open_map = []
            const x_match_map = []

            const regular_mode = resJson.data.regularSchedules.nodes[_rotation].regularMatchSetting.vsRule.name
            const anarchy_challenge_mode = resJson.data.bankaraSchedules.nodes[_rotation].bankaraMatchSettings[0].vsRule.name
            const anarchy_open_mode = resJson.data.bankaraSchedules.nodes[_rotation].bankaraMatchSettings[1].vsRule.name
            const x_match_mode = resJson.data.xSchedules.nodes[_rotation].xMatchSetting.vsRule.name

            const start = resJson.data.regularSchedules.nodes[_rotation].startTime
            const ends = resJson.data.regularSchedules.nodes[_rotation].endTime

            for (let i = 0; i < 2; ++i) {
                regular_map.push(resJson.data.regularSchedules.nodes[_rotation].regularMatchSetting.vsStages[i].name)
                anarchy_challenge_map.push(resJson.data.bankaraSchedules.nodes[_rotation].bankaraMatchSettings[0].vsStages[i].name)
                anarchy_open_map.push(resJson.data.bankaraSchedules.nodes[_rotation].bankaraMatchSettings[1].vsStages[i].name)
                x_match_map.push(resJson.data.xSchedules.nodes[_rotation].xMatchSetting.vsStages[i].name)
            }

            const rotation = {
                regular: {
                    start: start,
                    ends: ends,
                    mode: regular_mode,
                    maps: regular_map
                },
                anarchy: [
                    {
                        start: start,
                        ends: ends,
                        mode: anarchy_challenge_mode,
                        maps: anarchy_challenge_map
                    },
                    {
                        start: start,
                        ends: ends,
                        mode: anarchy_open_mode,
                        maps: anarchy_open_map
                    }
                ],
                x_match: {
                    start: start,
                    ends: ends,
                    mode: x_match_mode,
                    maps: x_match_map
                }
            }

            return rotation
        } catch (err) {
            console.log(err)
        }
    }

    async createImg (_map1, _map2, _outPath) {
        const canvas = createCanvas(1000, 500)
        const ctx = canvas.getContext('2d')

        const map1Img = await loadImage(`${this.imgUrlBase}${_map1.img}`);
        const map2Img = await loadImage(`${this.imgUrlBase}${_map2.img}`);
        
        ctx.drawImage(map1Img, 0, 0, 500, 500)
        ctx.drawImage(map2Img, 500, 0, 500, 500)

        writeFileSync(_outPath, canvas.toBuffer())
    }

    async buildEmbed(_rotation, _match, _lang, _interaction) {
        const mode = getMode(_rotation.mode)
        const match = getMatch(_match)
        const map1 = getMap(_rotation.maps[0])
        const map2 = getMap(_rotation.maps[1])

        const start = new Date(_rotation.start).getTime() / 1000
        const ends = new Date(_rotation.ends).getTime() / 1000

        const tmpImg = `/tmp/spl3/img/${match.en}.png`
        await this.createImg(map1, map2, tmpImg)

        const embed = new EmbedBuilder()
            .setColor(match.color)
            .setTitle(`${match.icon} ${match[_lang]}`)
            .setDescription(`<t:${start}> ~ <t:${ends}>`)
            .addFields(
                { name: `${mode.icon} ${mode[_lang]}`, value: `${map1[_lang]} :arrow_left: :arrow_right: ${map2[_lang]}` },
            )
            .setImage(`attachment://${match.en.replaceAll(' ', '_').replaceAll('(', '').replaceAll(')', '')}.png`)
            .setFooter({ text: `Requested by ${_interaction.user.username}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        return embed
    }

    async buildMessage (_lang, _rotation, _interaction) {
        const rotation = await this.fetchRotation(_rotation)

        const embeds = []
        embeds.push(await this.buildEmbed(rotation.regular, 'Regular Battle', _lang, _interaction))
        embeds.push(await this.buildEmbed(rotation.anarchy[0], 'Anarchy Battle (Series)', _lang, _interaction))
        embeds.push(await this.buildEmbed(rotation.anarchy[1], 'Anarchy Battle (Open)', _lang, _interaction))
        embeds.push(await this.buildEmbed(rotation.x_match, 'X Battle', _lang, _interaction))

        const attachments = []
        attachments.push('/tmp/spl3/img/Regular Battle.png')
        attachments.push('/tmp/spl3/img/Anarchy Battle (Series).png')
        attachments.push('/tmp/spl3/img/Anarchy Battle (Open).png')
        attachments.push('/tmp/spl3/img/X Battle.png')

        const row = this.buildLangSelect({rotation: _rotation}, _lang)

        return { embeds: embeds, components: [row], files: attachments }
    }
}

module.exports = CmdRotation
