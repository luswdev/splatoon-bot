const app = {
    data() {
        return {
            ranking: 0,
            ranking_str: 'C-',
            rank_list: ['C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S', 'S+'],
            results: [],
            max_wins: 5,
            max_loses: 3,
            max_results: 7,
            total_pt: 0,
            actually_pt: 0,
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
        return_medal: function (_medal) {
            if (_medal == 1) {
                return 'gold'
            } else if (_medal == 2) {
                return 'sliver'
            } else {
                return 'none'
            }
        },
        change_state: function (_result_idx) {
            this.results[_result_idx].win = !this.results[_result_idx].win
            this.check_done()
        },
        change_medal: function (_result_idx, _medal_idx) {
            this.results[_result_idx].medals[_medal_idx]++
            this.results[_result_idx].medals[_medal_idx] %= 3
        },
        update_ranking: function (_rank) {
            this.ranking_str = _rank
            if (_rank[0] == 'C') {
                this.ranking = 0
            } else if (_rank[0] == 'B') {
                this.ranking = 1
            } else if (_rank[0] == 'A') {
                this.ranking = 2
            } else if (_rank[0] == 'S') {
                this.ranking = 3
            } 
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
            wins = Math.min(wins, this.max_wins)

            const max_rank = 3
            let rank_idx = Math.min(this.ranking, max_rank)
            let total_pt = 0

            total_pt += wins_base_pt[rank_idx][wins]
            total_pt += golds * gold_base
            total_pt += sliver * sliver_base

            this.total_pt = total_pt
            this.update_actually_pt()
        },
        update_actually_pt: function () {
            const challenge_cost = [0, 20, 40, 55, 70, 85, 100, 110, 120, 150, 160]
            let rank_idx = this.rank_list.indexOf(this.ranking_str)

            this.actually_pt = this.total_pt
            this.actually_pt -= challenge_cost[rank_idx]
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
