'use strict'

const mapList = require('../data/map.js')
const weaponList = require('../data/weapon.js')

class Database {

    constructor () {
        this.mapList = mapList
        this.weaponList = weaponList
    }

    shuffle (_list) {
        for (let i = _list.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            [_list[i], _list[j]] = [_list[j], _list[i]];
        }
        return _list;
    }

    randomIdx (_range) {
        return Math.floor(Math.random() * Math.floor(_range))
    }

    random (_range) {
        const list = Array.from(Array(_range).keys())
        const slist = this.shuffle(list)
        const idx = this.randomIdx(_range)
        return slist[idx]
    }

    randomList (_list) {
        const listIdx = database.random(_list.cnt)
        const listRes = {
            en:  _list.en[listIdx],
            jp:  _list.jp[listIdx],
            zh:  _list.zh[listIdx],
            img: _list.img[listIdx],
            color: _list.color[listIdx],
        }
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
