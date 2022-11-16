'use strict'

class Log {

    constructor () {

    }

    write (_str) {
        console.log(`[${this.getCallerFile()}] ${_str}`)
    }

    getCallerFile() {
        let filename

        let pst = Error.prepareStackTrace
        Error.prepareStackTrace = function (err, stack) { return stack; }
        try {
            var err = new Error()
            var callerfile
            var currentfile

            currentfile = err.stack.shift().getFileName()

            while (err.stack.length) {
                callerfile = err.stack.shift().getFileName()

                if(currentfile !== callerfile) {
                    filename = callerfile
                    break
                }
            }
        } catch (err) {}
        Error.prepareStackTrace = pst

        return filename
    }
}

const logInst = new Log()

module.exports.log = logInst
