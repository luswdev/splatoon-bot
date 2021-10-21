const app = {
    data() {
        return {
            invite_url: 'https://discord.com/api/oauth2/authorize?client_id=898993695418908702&permissions=0&scope=bot%20applications.commands',
            commands: commands
        }
    },
    methods: {
        set_background_color: function (color) {
            return 'background-color: ' + color + ';'
        },
        set_icon: function (icon) {
            return 'fas ' + icon
        }
    }
}

Vue.createApp(app).mount('#app')
