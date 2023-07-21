const app = {
    data() {
        return {
            invite_url: 'https://discord.com/api/oauth2/authorize?client_id=898993695418908702&permissions=0&scope=bot%20applications.commands',
            commands: commands,
            hover_index: -1,
            copied: false,
            last_copied_index: -1,
            user_lang: '',
            tkey: tstrings,
        }
    },
    methods: {
        set_background_color: function (color) {
            return 'background-color: ' + color + ';'
        },
        set_icon: function (icon) {
            if (icon.indexOf('discord') !== -1) {
                return 'fa-brands ' + icon
            } else {
                return 'fas ' + icon
            }
        },
        copy_cmd: function(cmd) {
            navigator.clipboard.writeText(cmd)
            this.copied = true
            this.last_copied_index = this.hover_index

            var tooltip_el = document.getElementsByClassName('copy-btn')[this.last_copied_index]
            var tooltip = new bootstrap.Tooltip(tooltip_el)
            tooltip.enable()
            tooltip.show()

            setTimeout(() => {
                this.copied = false
                tooltip.hide()
                tooltip.disable()
            }, 1500)
        },
        get_font_by_lang: function (type) {
            if (this.user_lang.indexOf('zh') != -1) {
                return `splatoon-style-${type}-zh-tw`
            } else {
                return `splatoon-style-${type}`
            }
        },
        get_tstring: function (key,) {
            if (this.user_lang.indexOf('zh') != -1) {
                return this.tkey['zh'][key] ?? key
            } else {
                return this.tkey['en'][key] ?? key
            }
        }
    },
    watch: {
        hover_index: function (curr) {
            if (curr != -1) {
                this.copied = false
            }
        }
    },
    mounted: function () {
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                container: 'body',
                trigger : 'manual'
            });
        })
        this.user_lang = navigator.language || navigator.userLanguage;
    }
}
const appVm = Vue.createApp(app).mount('#app')

const header = {
    data() {
        return {
            links: header_links,
        }
    },
    methods: {
        get_tstring: appVm.get_tstring,
        get_font_by_lang: appVm.get_font_by_lang,
    }
}
const headerVm = Vue.createApp(header).mount('#header')

const footer = {
    data() {
        return {
            links: footer_links,
            version: '',
            author: '',
        }
    },
    methods: {
        get_tstring: appVm.get_tstring,
    },
    mounted: function () {
        axios.get('/splatoon/src/package.json').then( (res) => {
            this.version = res.data.version
            this.author = res.data.author
        })
    }
}

Vue.createApp(footer).mount('#footer')
