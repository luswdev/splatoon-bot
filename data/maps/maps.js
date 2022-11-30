'use strict'

const fs = require('fs')
const { log } = require('../../pkg/log.js')
const mapList = []

const arrJson = fs.readdirSync(__dirname)
arrJson.forEach(file => {
    if (file.indexOf('.json') != -1) {
        let obj = JSON.parse(fs.readFileSync(`${__dirname}/${file}`, 'utf8'))
        if (obj.img !== "") {
            mapList.push(obj)
        }
    }
})

log.write(`total maps: ${mapList.length}`)
log.write(`skip empty maps: ${arrJson.length - mapList.length - 2}`)

module.exports = mapList
