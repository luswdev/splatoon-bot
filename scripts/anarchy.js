const app = {
    data() {
        return {
            ranking: 0,
            ranking_str: 'C-',
            rank_list: ['C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S', 'S+'],
            results: [],
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
                    ++wins
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
            if (this.get_wins_cnt() >= MAX_WIN) {
                this.is_done = true
            } else if (this.get_loses_cnt() >= MAX_LOSE) {
                this.is_done = true
            } else if (this.results.length >= MAX_GAME) {
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
            return Object.keys(MEDAL_MAP)
                         .find(key => MEDAL_MAP[key] === _medal)
        },
        change_state: function (_result_idx) {
            this.results[_result_idx].win = !this.results[_result_idx].win
            this.check_done()
        },
        change_medal: function (_result_idx, _medal_idx) {
            this.results[_result_idx].medals[_medal_idx]++
            this.results[_result_idx].medals[_medal_idx] %= ENUM_MEDAL_COUNT
        },
        reset_results: function (e) {
            this.results = []
            this.check_done()
            setTimeout( () => {
                e.target.blur()
            }, 500)
        },
        update_ranking: function (_rank) {
            this.ranking_str = _rank
            this.ranking = RANK_MAP[_rank[0]]
            this.update_actually_pt()
            set_cookie(RANK_COOKIES_NAME, this.ranking_str, RANK_COOKIES_EXP_TIME, RANK_COOKIES_PATH)
        },
        update_pt: function () {
            let wins    = 0
            let golds   = 0
            let slivers = 0

            this.results.forEach( (res) => {
                if (res.win) {
                    ++wins
                }
                res.medals.forEach( (med) => {
                    if (med == MEDAL_MAP['gold']) {
                        ++golds
                    } else if (med == MEDAL_MAP['sliver']) {
                        ++slivers
                    }
                })
            })
            wins = Math.min(wins, MAX_WIN)

            let rank_idx = this.ranking
            let total_pt = 0

            total_pt += WIN_BASE_PT[rank_idx][wins]
            total_pt += golds   * GOLD_BASE
            total_pt += slivers * SLIVER_BASE

            this.total_pt = total_pt
            this.update_actually_pt()
        },
        update_actually_pt: function () {
            let rank_idx = this.rank_list.indexOf(this.ranking_str)
            this.actually_pt  = this.total_pt
            this.actually_pt -= CHALLENGE_COST[rank_idx]
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
    mounted: function () {
        let last_rank = get_cookie(RANK_COOKIES_NAME)
        if (last_rank == '') {
            last_rank = this.rank_list[0]
        }
        this.update_ranking(last_rank)
        this.update_pt()

        let windowsVH = window.innerHeight / 100;
        document.querySelector('body').style.setProperty('--vh', windowsVH + 'px')

        window.addEventListener('resize', function() {
            let windowsVH = window.innerHeight / 100;
            document.querySelector('body').style.setProperty('--vh', windowsVH + 'px')
        })
    },
}

Vue.createApp(app).mount('#app')
