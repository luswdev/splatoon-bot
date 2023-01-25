'use strict'

const _ = require('lodash');

const mapList = require('./maps/maps.js')
const weaponList = require('./weapons/weapons.js')

class Database {

    constructor () {
        this.mapList = mapList
        this.weaponList = weaponList
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

module.exports.getMap = (idx) => {
    const ret = database.mapList[idx]
    return ret
}
