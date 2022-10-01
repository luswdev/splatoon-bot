/**
 * cookies.js
 */

'use strict'

class Cookies {
    set(_cname, _cvalue, _exdays, _cpath) {
        const now = new Date()
        now.setTime(now.getTime() + (_exdays * 24 * 60 * 60 * 1000))
        let expires = `expires=${now.toUTCString()}`
        document.cookie = `${_cname}=${_cvalue};${expires};path=/${_cpath}`
    }

    get(_cname) {
        let name = `${_cname}=`
        let decoded_cookie = decodeURIComponent(document.cookie)
        let cookies_arr = decoded_cookie.split(';')
        for (let i = 0; i < cookies_arr.length; i++) {
            let cookie = cookies_arr[i]
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1)
            }
            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length)
            }
        }
        return ''
    }
}

let cookies = new Cookies()
