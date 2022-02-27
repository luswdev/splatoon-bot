axios.get('/splatoon/splatnet-data.json').then( (res) => {
    const app = {
        data() {
            return {
                'splatnet': res.data,
                'update': ''
            }
        },
        mounted: function () {
            let date = new Date(this.splatnet.update * 1000)
            let date_values = [
                date.getFullYear(),
                date.getMonth()+1,
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
            ]

            this.update  = `${date_values[0]}.`
            this.update += `${date_values[1] >= 10 ? '' : 0}${date_values[1]}.`
            this.update += `${date_values[2] >= 10 ? '' : 0}${date_values[2]} `
            this.update += `${date_values[3] >= 10 ? '' : 0}${date_values[3]}:`
            this.update += `${date_values[4] >= 10 ? '' : 0}${date_values[4]}:`
            this.update += `${date_values[5] >= 10 ? '' : 0}${date_values[5]}`
        }
    }
    
    Vue.createApp(app).mount('#app')
})
