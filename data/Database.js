'use strict'

const _ = require('lodash')
const { readdirSync, readFileSync } = require('fs')
const { join } = require('path')

const { log } = require('../pkg/Log.js')

class Database {

    constructor () {
        this.dataList = {}

        const dataList = readdirSync(join(__dirname, "./"), { withFileTypes: true })
            .filter( (dir) => dir.isDirectory())
            .map( (dir) => dir.name)

        dataList.forEach( (data) => {
            this.buildList(data)
        })
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

        let obj = {}
        obj[_path] = list
        this.dataList = {...this.dataList, ...obj}
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

    getListIdx (_target, _list) {
        const ret = database.dataList[_list].indexOf(_target)
        return ret
    }

    getListObject (_target, _list) {
        let ret
        if (typeof(_target) == 'string') {
            ret = database.dataList[_list].find( (e) => e.en == _target)
        } else {
            ret = database.dataList[_list][_target]
        }
        return ret
    }
}

const database = new Database()

module.exports.randomMap = () => {
    const ret = database.randomList(database.dataList['maps'])
    return ret
}

module.exports.randomWeapon = () => {
    const ret = database.randomList(database.dataList['weapons'])
    return ret
}

module.exports.weaponIdx = (weapon) => {
    return database.getListIdx(weapon, 'weapons')
}

module.exports.mapIdx = (map) => {
    return database.getListIdx(map, 'maps')
}

module.exports.getWeapon = (tar) => {
    return database.getListObject(tar, 'weapons')
}

module.exports.getMap = (tar) => {
    return database.getListObject(tar, 'maps')
}

module.exports.getMode = (tar) => {
    return database.getListObject(tar, 'modes')
}

module.exports.getMatch = (tar) => {
    return database.getListObject(tar, 'matches')
}

module.exports.getSalmon = (tar) => {
    return database.getListObject(tar, 'salmon_run')
}

module.exports.getLabel = (tar) => {
    return database.getListObject(tar, 'labels')
}
