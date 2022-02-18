<?php

include_once __DIR__.'/splatnet-config.php';

header('Content-Type: text/plain; charset=utf-8');

/*********************** build config header ***********************/

$app_timezone_offset;
$app_unique_id;
$app_user_agent;
$api_key = config['api_key'];
$api_cookie = config['api_cookie'];
$session_token = config['session_token'];
$user_lang = config['user_lang'];

if(array_key_exists('app_timezone_offset', config)) {
    $app_timezone_offset = config['app_timezone_offset'];
} else {
    $ori_time_zone = new DateTimeZone("UTC");
    $cur_time_zone = new DateTimeZone(date_default_timezone_get());

    $ori_date = new DateTime("now", $ori_time_zone);
    $cur_date = new DateTime("now", $cur_time_zone);

    $time_ofst = $ori_time_zone->getOffset($cur_date);

    if ($time_ofst == 0) {
        $time_ofst = 0 - $cur_time_zone->getOffset($ori_date);
    }

    $app_timezone_offset = $time_ofst / 60;
}

if(array_key_exists('app_unique_id', config)) {
    $app_unique_id = config['app_unique_id'];
} else {
    $app_unique_id = '32449507786579989234';
}

if(array_key_exists('app_user_agent', config)) {
    $app_user_agent = config['app_user_agent'];
} else {
    $app_user_agent = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Mobile Safari/537.36';
}

$curl_opt = array(
    'method' => 'get',
    'url' => 'https://app.splatoon2.nintendo.net/api/',
    'headers' => array(
        'Host' => 'app.splatoon2.nintendo.net',
        'x-unique-id' => $app_unique_id,
        'x-requested-with' => 'XMLHttpRequest',
        'x-timezone-offset' => strval($app_timezone_offset),
        'User-Agent' => $app_user_agent,
        'Accept' => '*/*',
        'Referer' => 'https://app.splatoon2.nintendo.net/home',
        'Accept-Encoding' => 'gzip, deflate',
        'Accept-Language' => $user_lang,
    ),
    'Cookie' => array(
        'iksm_session' => $api_cookie
    )
);

$ch = curl_init();

curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, $curl_opt['headers']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_COOKIE, 'iksm_session='.$curl_opt['Cookie']['iksm_session']);

/*********************** api: records ***********************/

curl_setopt($ch, CURLOPT_URL, $curl_opt['url'].'records');
$ret = json_decode(curl_exec($ch), true);

$id = $ret['records']['player']['principal_id'];

$rank = array (
    array (
        'mode' => 'Splat Zones',
        'rank' => $ret['records']['player']['udemae_zones']['name'],
        'sp'   => $ret['records']['player']['udemae_zones']['s_plus_number']
    ),
    array (
        'mode' => 'Tower Control',
        'rank' => $ret['records']['player']['udemae_tower']['name'],
        'sp'   => $ret['records']['player']['udemae_tower']['s_plus_number']
    ),
    array (
        'mode' => 'Rainmaker',
        'rank' => $ret['records']['player']['udemae_rainmaker']['name'],
        'sp'   => $ret['records']['player']['udemae_rainmaker']['s_plus_number']
    ),
    array (
        'mode' => 'Clam Blitz',
        'rank' => $ret['records']['player']['udemae_clam']['name'],
        'sp'   => $ret['records']['player']['udemae_clam']['s_plus_number']
    )
);

$level       = $ret['records']['player']['player_rank'];
$star        = $ret['records']['player']['star_rank'];
$total_paint = $ret['challenges']['total_paint_point'];
$ign         = $ret['records']['player']['nickname'];
$dc          = $ret['records']['recent_disconnect_count'];

$life_win = $ret['records']['win_count'];
$life_lose = $ret['records']['lose_count'];

$pair = array (
    'gold'   => $ret['records']['league_stats']['pair']['gold_count'],
    'sliver' => $ret['records']['league_stats']['pair']['silver_count'],
    'bronze' => $ret['records']['league_stats']['pair']['bronze_count'],
    'high'   => $ret['records']['player']['max_league_point_pair']
);

$team = array (
    'gold'   => $ret['records']['league_stats']['team']['gold_count'],
    'sliver' => $ret['records']['league_stats']['team']['silver_count'],
    'bronze' => $ret['records']['league_stats']['team']['bronze_count'],
    'high'   => $ret['records']['player']['max_league_point_team']
);

/*********************** api: results ***********************/

curl_setopt($ch, CURLOPT_URL, $curl_opt['url'].'results');
$ret = json_decode(curl_exec($ch), true);

$battle = array (
    'win'    => $ret['summary']['victory_count'],
    'lose'   => $ret['summary']['defeat_count'],
    'sp'     => round($ret['summary']['special_count_average'] * 10) / 10,
    'kill'   => round($ret['summary']['kill_count_average'] * 10) / 10,
    'assist' => round($ret['summary']['assist_count_average'] * 10) / 10,
);

$sp_ico = 'https://app.splatoon2.nintendo.net' . $ret['results'][0]['player_result']['player']['weapon']['special']['image_a'];

/*********************** api: nickname_and_icon ***********************/

curl_setopt($ch, CURLOPT_URL, $curl_opt['url'].'nickname_and_icon?id='.$id);
$ret = json_decode(curl_exec($ch), true);

$ico = $ret['nickname_and_icons'][0]['thumbnail_url'];

/*********************** api: records/hero ***********************/

curl_setopt($ch, CURLOPT_URL, $curl_opt['url'].'records/hero');
$ret = json_decode(curl_exec($ch), true);

$hero_title = $ret['summary']['honor']['name'];
$hero_per = 1000;

$splatnet = array (
    'rank' => $rank,
    'battle' => array (
        'summary' => $battle,
        'sp' => $sp_ico,
        'life' => array (
            'win' => $life_win,
            'lose' => $life_lose
        )
    ),
    'league' => array (
        'team' => $team,
        'pair' => $pair
    ),
    'hero' => array (
        'title' => $hero_title,
        'percent' => intval($hero_per)
    ),
    'user' => array (
        'ign' => $ign,
        'ico' => $ico,
        'dc' => $dc,
        'level' => array (
            'num' => $level,
            'star' => $star
        ),
        'inks' => $total_paint
    )
);

/*********************** output to JSON ***********************/

print_r(json_encode($splatnet, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

touch('../splatnet-data.json');
$fp = fopen('../splatnet-data.json', 'w');
fwrite($fp, json_encode($splatnet, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
fclose($fp);

curl_close($ch);
