const app = {
    data() {
        return {
            ranking: 0,
            results: [],
            max_wins: 5,
            max_loses: 3,
            max_results: 7,
            total_pt: 0,
            is_done: false
        }
    },
    methods: {
        get_wins_cnt: function () {
            let wins = 0
            this.results.forEach( (res) => {
                if (res.win) {
                    wins++
                }
            })
            return wins
        },
        get_loses_cnt: function () {
            let loses = 0
            this.results.forEach( (res) => {
                if (!res.win) {
                    loses++
                }
            })
            return loses
        },
        check_done: function () {
            if (this.get_wins_cnt() >= this.max_wins) {
                this.is_done = true
            } else if (this.get_loses_cnt() >= this.max_loses) {
                this.is_done = true
            } else if (this.results.length >= this.max_results) {
                this.is_done = true
            } else {
                this.is_done = false
            }
        },
        add_result_entry: function () {
            let result_row = {
                win: true,
                medals: [ 0, 0, 0]
            }
            this.results.push(result_row)
            this.check_done()
        },
        change_state: function (_result_idx) {
            this.results[_result_idx].win = !this.results[_result_idx].win
            this.check_done()
        },
        change_medal: function (_result_idx, _medal_idx) {
            this.results[_result_idx].medals[_medal_idx]++
            this.results[_result_idx].medals[_medal_idx] %= 3
        },
        update_pt: function () {
            let wins = 0
            let golds = 0
            let sliver = 0

            const wins_base_pt = [
                [0, 20,  45,  75, 110, 150],
                [0, 30,  65, 105, 150, 200],
                [0, 40,  85, 135, 190, 250],
                [0, 50, 105, 165, 230, 300]
            ]
            const gold_base = 5
            const sliver_base = 1

            this.results.forEach( (res) => {
                if (res.win) {
                    wins++
                }
                res.medals.forEach( (med) => {
                    if (med == 1) {
                        golds++
                    } else if (med == 2) {
                        sliver++
                    }
                })
            })

            const max_rank = 3
            let rank_idx = Math.min(this.ranking, max_rank)
            let total_pt = 0

            total_pt += wins_base_pt[rank_idx][wins]
            total_pt += golds * gold_base
            total_pt += sliver * sliver_base

            this.total_pt = total_pt
        }
    },
    watch: {
        results: {
            handler: function () {
                this.update_pt()
            },
            deep: true
        },
        ranking: {
            handler: function () {
                this.update_pt()
            },
            deep: true
        }
    },
}

Vue.createApp(app).mount('#app')
