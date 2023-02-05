'use strict'

const schedule = require('node-schedule')
const axios = require('axios')
const { mkdirSync, writeFileSync } = require('fs')
const { createCanvas, loadImage } = require('canvas')

const { getMap } = require('../data/Database.js')
const { log } = require('./Log.js')

class Splatoon3Ink {

    constructor () {
        this.apiBase = 'https://splatoon3.ink/data/'
        this.dataOut = '/tmp/spl3/'
        this.imgOut = '/tmp/spl3/img/'
        this.imgSrc = `${__dirname}/../img/map/`
        this.rotationData = undefined

        mkdirSync(this.imgOut, { recursive: true });
    }

    async fetchRotation (_rotation) {
        try {
            const url = 'schedules.json'
            log.write(`fetching ${this.apiBase}${url}`)

            const res = await axios.get(`${this.apiBase}${url}`)
            this.rotationData = res.data.data
        } catch (err) {
            console.log(err)
        }
    }

    async parseRotation (_idx) {
        let rotation = []

        const matchObject = [
            this.rotationData.regularSchedules.nodes[_idx].regularMatchSetting,
            this.rotationData.bankaraSchedules.nodes[_idx].bankaraMatchSettings[0],
            this.rotationData.bankaraSchedules.nodes[_idx].bankaraMatchSettings[1],
            this.rotationData.xSchedules.nodes[_idx].xMatchSetting
        ]

        const matchName = [
            'Regular Battle',
            'Anarchy Battle (Series)',
            'Anarchy Battle (Open)',
            'X Battle'
        ]

        const period = {
            start: this.rotationData.xSchedules.nodes[_idx].startTime,
            ends:  this.rotationData.xSchedules.nodes[_idx].endTime
        }

        for (let i = 0; i < matchObject.length; ++i) {
            let maps = [ matchObject[i].vsStages[0].name, matchObject[i].vsStages[1].name ]
            let mode = matchObject[i].vsRule.name
            rotation.push({
                match: matchName[i],
                period: period,
                maps: maps,
                mode: mode
            })

            await this.createImg(maps, matchName[i], _idx)
        }

        return rotation
    }

    async createImg (_maps, _match, _idx) {
        const imgOutPath = `${this.imgOut}${_match}_${_idx}.png`
    
        const map1 = getMap(_maps[0])
        const map2 = getMap(_maps[1])

        const canvas = createCanvas(1000, 500)
        const ctx = canvas.getContext('2d')

        const map1Img = await loadImage(`${this.imgSrc}${map1.img}`);
        const map2Img = await loadImage(`${this.imgSrc}${map2.img}`);
        
        ctx.drawImage(map1Img, 0, 0, 500, 500)
        ctx.drawImage(map2Img, 500, 0, 500, 500)

        writeFileSync(imgOutPath, canvas.toBuffer())
    }

    async buildRotations () {
        await this.fetchRotation()

        let rotations = []
        for (let i = 0; i < 12; ++i) {
            rotations.push(await this.parseRotation(i))
        }

        writeFileSync(`${this.dataOut}rotation.json`, JSON.stringify(rotations))
    }
}

module.exports.splatoon3InkScheduler = () => {
    let splatoon3Ink = new Splatoon3Ink()

    log.write(`start fetch ${splatoon3Ink.apiBase} every 2 hours`)
    schedule.scheduleJob('1 */2 * * *', () => {
        splatoon3Ink.buildRotations()
    })
}
