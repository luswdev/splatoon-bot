'use strict'

const _ = require('lodash')
const { readdirSync, readFileSync } = require('fs')

const { log } = require('../pkg/Log.js')

class Database {

    constructor () {
        this.mapList = this.buildList('maps')
        this.weaponList = this.buildList('weapons')
        this.modeList = this.buildList('modes')
        this.matchList = this.buildList('matches')
    }

    buildList (_path) {
        let list = []

        const arrJson = readdirSync(`${__dirname}/${_path}`)
        for (let file of arrJson) {
            if (file.indexOf('.json') !== -1) {
                let obj = JSON.parse(readFileSync(`${__dirname}/${_path}/${file}`, 'utf8'))
                if (obj.en !== '') {
                    list.push(obj)
                }
            }
        }

        log.write(`load ${_path}: ${list.length}`)
        log.write(`skip empty ${_path}: ${arrJson.length - list.length - 1}`)

        return list
    }

    random (_range) {
        const list = _.range(_range)
        const slist = _.shuffle(list)
        const idx = _.random(_range - 1)
        return slist[idx]
    }

    randomList (_list) {
        const listIdx = database.random(_list.length)
        const listRes = _list[listIdx]
        return listRes
    }
}

const database = new Database()

module.exports.randomMap = () => {
    const ret = database.randomList(database.mapList)
    return ret
}

module.exports.randomWeapon = () => {
    const ret = database.randomList(database.weaponList)
    return ret
}

module.exports.weaponIdx = (weapon) => {
    const ret = database.weaponList.indexOf(weapon)
    return ret
}

module.exports.mapIdx = (map) => {
    const ret = database.mapList.indexOf(map)
    return ret
}

module.exports.getWeapon = (idx) => {
    const ret = database.weaponList[idx]
    return ret
}

module.exports.getMap = (tar) => {
    let ret
    if (typeof(tar) == 'string') {
        ret = database.mapList.find( (e) => e.en == tar)
    } else {
        ret = database.mapList[tar]
    }
    return ret
}

module.exports.getMode = (name) => {
    const ret = database.modeList.find( (e) => e.en == name)
    return ret
}

module.exports.getMatch = (name) => {
    const ret = database.matchList.find( (e) => e.en == name)
    return ret
}
