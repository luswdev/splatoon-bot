'use strict'

const schedule = require('node-schedule')
const axios = require('axios')
const { mkdirSync, writeFileSync, createWriteStream } = require('fs')
const { createCanvas, loadImage } = require('canvas')
const looksSame = require('looks-same')

const database = require('data/Database.js')
const { log } = require('utils/Log.js')
const { findImg } = require('utils/ImgFinder.js')

class Splatoon3Ink {

    constructor () {
        this.apiBase = 'https://splatoon3.ink/data/'
        this.dataOut = '/tmp/spl3/'
        this.imgOut = '/tmp/spl3/img/'
        this.imgSrc = `${__dirname}/../img/map/`
        this.rotationData = undefined
        this.salmonType = Object.freeze({ 'salmonRun': 'Salmon Run Next Wave', 'bigRun': 'Big Run', 'teamContest': 'Eggstra Work' })

        mkdirSync(this.imgOut, { recursive: true })
    }

    async fetchRotation (_rotation) {
        try {
            const url = 'schedules.json'
            log.write('fetching', this.apiBase + url)

            const res = await axios.get(`${this.apiBase}${url}`)
            this.rotationData = res.data.data
        } catch (err) {
            log.write('fetching failed:', err)
        }
    }

    async parseBattle (_idx, isFest) {
        let rotation = []

        const matchObject = [
            isFest ? undefined : this.rotationData.regularSchedules.nodes[_idx].regularMatchSetting,
            isFest ? undefined : this.rotationData.bankaraSchedules.nodes[_idx].bankaraMatchSettings[0],
            isFest ? undefined : this.rotationData.bankaraSchedules.nodes[_idx].bankaraMatchSettings[1],
            isFest ? undefined : this.rotationData.xSchedules.nodes[_idx].xMatchSetting,
            isFest ? this.rotationData.festSchedules.nodes[_idx].festMatchSetting : undefined,
        ]

        const matchName = [
            'Regular Battle',
            'Anarchy Battle (Series)',
            'Anarchy Battle (Open)',
            'X Battle',
            'Splatfest'
        ]

        const period = {
            start: this.rotationData.xSchedules.nodes[_idx].startTime,
            ends:  this.rotationData.xSchedules.nodes[_idx].endTime
        }

        for (let i = 0; i < matchObject.length; ++i) {
            let maps, mode
            if (matchObject[i] === undefined) {
                maps = [ undefined, undefined ]
                mode = undefined
            } else {
                maps = [ matchObject[i].vsStages[0].name, matchObject[i].vsStages[1].name ]
                mode = matchObject[i].vsRule.name

                await this.createImg(maps, matchName[i], _idx)
            }

            rotation.push({
                match: matchName[i],
                period: period,
                maps: maps,
                mode: mode
            })
        }

        return rotation
    }

    async createImg (_maps, _match, _idx) {
        const imgOutPath = `${this.imgOut}${_match}_${_idx}.png`
    
        const map1 = database.getListObject(_maps[0], 'maps')
        const map2 = database.getListObject(_maps[1], 'maps')

        const canvas = createCanvas(1000, 500)
        const ctx = canvas.getContext('2d')

        const map1Img = await loadImage(findImg('maps_small', map1.en) )
        const map2Img = await loadImage(findImg('maps_small', map2.en) )
        
        ctx.drawImage(map1Img, 0, 0, 500, 500)
        ctx.drawImage(map2Img, 500, 0, 500, 500)

        writeFileSync(imgOutPath, canvas.toBuffer())
    }

    async downloadImg (_url, _path) {
        const res = await axios.get(_url, {responseType: 'stream'})
        res.data.pipe(createWriteStream(_path))
    }

    async parseSalmonRun (_type, _set) {
        const period = {
            start: _set.startTime,
            ends:  _set.endTime
        }

        let weapons = []
        for (let weapon of _set.setting.weapons) {
            if (weapon.name.indexOf('Random') !== -1) {
                const tmpImgPath = `${this.imgOut}${weapon.__splatoon3ink_id}.png`
                await this.downloadImg(weapon.image.url, tmpImgPath)

                const comp = await looksSame(findImg('salmon_run', 'RareRandom'), tmpImgPath)
                weapons.push(`${comp.equal ? 'Rare' : ''}${weapon.name}`)
            } else {
                weapons.push(weapon.name)
            }
        }

        let rotation = {
            match: _type,
            bigRun: _type == this.salmonType.bigRun,
            period: period,
            map: _set.setting.coopStage.name,
            boss: _set.__splatoon3ink_king_salmonid_guess,
            weapons: weapons
        }

        return rotation
    }

    async buildRotations () {
        await this.fetchRotation()

        let battles = []
        for (let i = 0; i < this.rotationData.regularSchedules.nodes.length; ++i) {
            let isFest = (this.rotationData.regularSchedules.nodes[i].festMatchSetting !== null)
            battles.push(await this.parseBattle(i, isFest))
        }

        let salmonRuns = []
        for (let set of this.rotationData.coopGroupingSchedule.regularSchedules.nodes) {
            salmonRuns.push(await this.parseSalmonRun(this.salmonType.salmonRun, set))
        }

        for (let set of this.rotationData.coopGroupingSchedule.bigRunSchedules.nodes) {
            salmonRuns.push(await this.parseSalmonRun(this.salmonType.bigRun, set))
        }

        salmonRuns.sort((r1, r2) => new Date(r1.period.start) - new Date(r2.period.start))

        let teamContests = []
        for (let set of this.rotationData.coopGroupingSchedule.teamContestSchedules.nodes) {
            teamContests.push(await this.parseSalmonRun(this.salmonType.teamContest, set))
        }

        let rotations = {
            battles: battles,
            salmonRuns: salmonRuns,
            teamContests: teamContests,
        }

        writeFileSync(`${this.dataOut}rotation.json`, JSON.stringify(rotations, (k, v) => v === undefined ? null : v))
    }
}

module.exports.runFetch = () => {
    let splatoon3Ink = new Splatoon3Ink()
    splatoon3Ink.buildRotations()
}

module.exports.splatoon3InkScheduler = () => {
    let splatoon3Ink = new Splatoon3Ink()

    log.write('start fetch', splatoon3Ink.apiBase, 'every 2 hours')
    schedule.scheduleJob('1 */2 * * *', () => {
        splatoon3Ink.buildRotations()
    })
}
