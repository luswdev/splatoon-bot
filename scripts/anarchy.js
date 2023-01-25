const app = {
    data() {
        return {
            ranking: 0,
            ranking_str: 'C-',
            rank_list: ['C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S', 'S+'],
            results: [],
            total_pt: 0,
            actually_pt: 0,
            is_done: false,
            is_share: false,
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
            if (this.is_share) {
                this.is_done = true
            } else if (this.get_wins_loses_cnt(true) >= MAX_WIN) {
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
            if (this.is_share) {
                window.location.href = '/splatoon/anarchy'
            }

            this.share_result()

            this.results = []
            this.check_done()
            setTimeout( () => {
                _e.target.blur()
            }, 500)
        },
        share_result: function () {
            let res_url = ''
            let win_seq = 0

            res_url += this.rank_list.findIndex((r) => r == this.ranking_str).toString(16)
            res_url += this.results.length.toString(16)
            this.results.forEach( (res, idx) => {
                win_seq |= (res.win << idx)
                
                let gold = res.medals.filter(med => med === MEDAL_MAP['gold']).length
                let sliver = res.medals.filter(med => med === MEDAL_MAP['sliver']).length

                let medal = gold << 2 | sliver

                res_url += medal.toString(16)

                // cnt += res.medals.filter(med => med === MEDAL_MAP[_medal_type]).length
            })
            res_url += win_seq.toString(16)

            console.log(res_url)
            return res_url
        },
        output_share: function (_r) {
            this.update_ranking(this.rank_list[parseInt(_r[0], 16)])

            let result_cnt = parseInt(_r[1], 16)
            for (let i = 0; i < result_cnt; ++i) {
                let gold = (parseInt(_r[2 + i], 16) >> 2) & 0x03
                let sliver = parseInt(_r[2 + i], 16) & 0x03
                let result_row = {
                    win: parseInt(_r[2 + result_cnt], 16) & (1 << i),
                    medals: [0, 0, 0]
                }
                let medal_idx = 0
                while (gold--) {
                    result_row.medals[medal_idx++] = MEDAL_MAP['gold']
                }
                while (sliver--) {
                    result_row.medals[medal_idx++] = MEDAL_MAP['sliver']
                }
                this.results.push(result_row)
                this.check_done()
            }
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
        },
    },
    mounted: function () {
        let get_idx = window.location.href.indexOf('?r=')
        let share_data = ''
        if (get_idx > -1) {
            share_data = window.location.href.substring(get_idx + 3)
            this.is_share = true
            this.output_share(share_data)
            return
        }

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
