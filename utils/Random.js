'use strict'

const MersenneTwister = require('mersenne-twister')

class Random {
    constructor () {
        this.twister = new MersenneTwister()
    }

    initRandom () {
        this.twister.init_seed(Date.now())
    }

    getRandomRange (_range) {
        return Math.floor(this.twister.random() * Math.floor(_range))
    }
}

module.exports = Random
