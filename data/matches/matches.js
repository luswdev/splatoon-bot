'use strict'

const fs = require('fs')
const matchList = []

const arrJson = fs.readdirSync(__dirname)
arrJson.forEach(file => {
    if (file.indexOf('.json') != -1) {
        let obj = JSON.parse(fs.readFileSync(`${__dirname}/${file}`, 'utf8'))
        if (obj.icon !== "") {
            matchList.push(obj)
        }
    }
})

module.exports = matchList
