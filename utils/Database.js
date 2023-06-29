'use strict'

const { readdirSync, readFileSync } = require('fs')
const { join, parse } = require('path')

const { log } = require('utils/Log.js')

class Database {

    constructor () {
        this.dataList = {}

        const dataFileList = readdirSync(join(__dirname, '..', 'data'), { withFileTypes: true })

        for (let data of dataFileList) {
            const topKey = parse(data.name).name
            const dataFile = join(__dirname, '..', 'data', data.name)
            this.dataList[topKey] = JSON.parse(readFileSync(dataFile, 'utf8'))

            log.write('load', topKey, 'data object done')
        }
    }

    getListObject (_category, _key) {
        let obj = {}
        for (let list in this.dataList) {
            if (!this.dataList[list][_category]) {
                obj[list] = this.dataList[list]['Label']['Dummy']
                continue
            }

            obj[list] = this.dataList[list][_category][_key]
            if (!obj[list]) {
                obj[list] = `${this.dataList[list]['Label']['Dummy']}_${_category}_${_key}`
            }
        }
        return obj
    }

    getListKey (_category, _obj) {
        for (let list in this.dataList) {
            if (list === 'color' || list === 'icon') {
                continue
            }

            const listKeys = Object.keys(this.dataList[list][_category])
            const hasKey = listKeys.find((e) => this.dataList[list][_category][e] === _obj)
            if (hasKey) {
                return hasKey
            }
        }

        return _obj // key not found
    }
}

const database = new Database()
module.exports = database
