'use strict'

const fs = require('fs')
const { log } = require('../../pkg/log.js')
const weaponList = []

const arrJson = fs.readdirSync(__dirname)
arrJson.forEach(file => {
    if (file.indexOf('.json') != -1) {
        let obj = JSON.parse(fs.readFileSync(`${__dirname}/${file}`, 'utf8'))
        if (obj.icon !== "") {
            weaponList.push(obj)
        }
    }
})

log.write(`total weapons: ${weaponList.length}`)
log.write(`skip empty weapons: ${arrJson.length - weaponList.length - 2}`)

module.exports = weaponList
