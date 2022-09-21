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
        get_wins_loses_cnt: function (_is_win) {
            return this.results.filter(res => res.win === _is_win).length
        },
        get_medal_cnt: function (_medal_type) {
            let cnt = 0
            this.results.forEach( (res) => {
                cnt += res.medals.filter(med => med === MEDAL_MAP[_medal_type]).length
            })
            return cnt
        },
        get_medal_str: function (_medal) {
            return Object.keys(MEDAL_MAP)
                         .find(key => MEDAL_MAP[key] === _medal)
        },
        check_done: function () {
            if (this.get_wins_loses_cnt(true) >= MAX_WIN) {
                this.is_done = true
            } else if (this.get_wins_loses_cnt(false) >= MAX_LOSE) {
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
                medals: [0, 0, 0]
            }
            this.results.push(result_row)
            this.check_done()
        },
        next_state: function (_result_idx) {
            this.results[_result_idx].win = !this.results[_result_idx].win
            this.check_done()
        },
        next_medal: function (_result_idx, _medal_idx) {
            this.results[_result_idx].medals[_medal_idx]++
            this.results[_result_idx].medals[_medal_idx] %= Object.keys(MEDAL_MAP).length
        },
        update_ranking: function (_rank) {
            this.ranking_str = _rank
            this.ranking = RANK_MAP[_rank[0]]
            this.update_actually_pt()
            cookies.set(RANK_COOKIES_NAME, this.ranking_str, RANK_COOKIES_EXP_TIME, RANK_COOKIES_PATH)
        },
        update_pt: function () {
            let wins    = this.get_wins_loses_cnt(true)
            let golds   = this.get_medal_cnt('gold')
            let slivers = this.get_medal_cnt('sliver')

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
        },
        reset_results: function (_e) {
            this.results = []
            this.check_done()
            setTimeout( () => {
                _e.target.blur()
            }, 500)
        },
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
        },
    },
    mounted: function () {
        let last_rank = cookies.get(RANK_COOKIES_NAME)
        if (last_rank === '') {
            last_rank = this.rank_list[0]
        }
        this.update_ranking(last_rank)
        this.update_pt()

        let windowsVH = window.innerHeight / 100
        document.querySelector('body').style.setProperty('--vh', windowsVH + 'px')

        window.addEventListener('resize', function() {
            let windowsVH = window.innerHeight / 100
            document.querySelector('body').style.setProperty('--vh', windowsVH + 'px')
        })
    },
}

Vue.createApp(app).mount('#app')
