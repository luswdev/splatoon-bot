axios.get('/splatoon/splatnet-data.json').then( (res) => {
    const app = {
        data() {
            return {
                'splatnet': res.data
            }
        },
        mounted: function () {
            
        }
    }
    
    Vue.createApp(app).mount('#app')
})
