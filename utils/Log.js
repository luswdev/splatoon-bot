'use strict'

class Log {

    constructor () {

    }

    write (..._args) {
        console.log(`${this.getCallerFile()}:`, ..._args)
    }

    getCallerFile() {
        let filePath

        let pst = Error.prepareStackTrace
        Error.prepareStackTrace = function (err, stack) { return stack }
        try {
            var err = new Error()
            var callerFile
            var currentFile

            currentFile = err.stack.shift().getFileName()

            while (err.stack.length) {
                callerFile = err.stack.shift().getFileName()

                if(currentFile !== callerFile) {
                    filePath = callerFile
                    break
                }
            }
        } catch (err) {}
        Error.prepareStackTrace = pst

        let folders = filePath.split('/')
        let fileName = folders[folders.length - 1]
        let fileNameExt = fileName.split('.js')
        let file = fileNameExt[0]

        return file
    }
}

const logInst = new Log()

module.exports.log = logInst
