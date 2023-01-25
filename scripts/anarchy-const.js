const MAX_WIN  = 5
const MAX_LOSE = 3
const MAX_GAME = MAX_WIN + MAX_LOSE - 1

const GOLD_BASE   = 5
const SLIVER_BASE = 1

const C_WIN_BASE_PT = [0, 20,  45,  75, 110, 150]
const B_WIN_BASE_PT = [0, 30,  65, 105, 150, 200]
const A_WIN_BASE_PT = [0, 40,  85, 135, 190, 250]
const S_WIN_BASE_PT = [0, 50, 105, 165, 230, 300]
const WIN_BASE_PT   = [
    C_WIN_BASE_PT,
    B_WIN_BASE_PT,
    A_WIN_BASE_PT,
    S_WIN_BASE_PT
]

const C_CHALLENGE_COST = [  0,  20, 40]
const B_CHALLENGE_COST = [ 55,  70, 85]
const A_CHALLENGE_COST = [110, 120, 130]
const S_CHALLENGE_COST = [170, 180]
const CHALLENGE_COST   = [ ].concat(C_CHALLENGE_COST)
                            .concat(B_CHALLENGE_COST)
                            .concat(A_CHALLENGE_COST)
                            .concat(S_CHALLENGE_COST)

const MEDAL_MAP = {
    'none':   0,
    'gold':   1,
    'sliver': 2,
}

const RANK_MAP = {
    'C': 0,
    'B': 1,
    'A': 2,
    'S': 3,
}

const RANK_COOKIES_NAME     = 'sp3-rank'
const RANK_COOKIES_EXP_TIME = 93            // 3 months
const RANK_COOKIES_PATH     = 'splatoon'
