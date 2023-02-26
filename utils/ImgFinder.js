'use strict'
const { readdirSync } = require('fs')
const { join } = require('path')

class ImgFinder {

    constructor () {
        this.imgCategory = readdirSync(join(__dirname, '..', 'images'), { withFileTypes: true })
            .filter( (dir) => dir.isDirectory() )
            .map( (dir) => dir.name)
    }

    find (_category, _name) {
        if (!this.imgCategory.find( (category) => category === _category)) {
            return ''
        }

        let regex = /[-'_. ]/ig
        let imgName = _name.replaceAll(regex, '')

        return `${join('images', _category, imgName)}.png`
    }
}

const imgFinder = new ImgFinder()
module.exports.findImg = (_category, _name) => imgFinder.find(_category, _name)
