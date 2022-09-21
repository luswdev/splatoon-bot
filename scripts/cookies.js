/**
 * cookies.js
 */

'use strict'

class Cookies {
    set(_cname, _cvalue, _exdays, _cpath) {
        const d = new Date()
        d.setTime(d.getTime() + (_exdays * 24 * 60 * 60 * 1000))
        let expires = `expires=${d.toUTCString()}`
        document.cookie = `${_cname}=${_cvalue};${expires};path=/${_cpath}`
    }

    get(_cname) {
        let name = `${_cname}=`
        let decoded_cookie = decodeURIComponent(document.cookie)
        let ca = decoded_cookie.split(';')
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            }
        }
        return ''
    }
}

let cookies = new Cookies()
