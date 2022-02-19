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
$ret_records = json_decode(curl_exec($ch), true);
write_json($ret_records, '/../log/splatnet-records.json');

/*********************** api: results ***********************/

curl_setopt($ch, CURLOPT_URL, $curl_opt['url'].'results');
$ret_results = json_decode(curl_exec($ch), true);
write_json($ret_results, '/../log/splatnet-results.json');

/*********************** api: nickname_and_icon ***********************/

$id = $ret_records['records']['player']['principal_id'];
curl_setopt($ch, CURLOPT_URL, $curl_opt['url'].'nickname_and_icon?id='.$id);
$ret_nick = json_decode(curl_exec($ch), true);
write_json($ret_nick, '/../log/splatnet-nick.json');

/*********************** api: records/hero ***********************/

curl_setopt($ch, CURLOPT_URL, $curl_opt['url'].'records/hero');
$ret_hero = json_decode(curl_exec($ch), true);
write_json($ret_hero, '/../log/splatnet-hero.json');
curl_close($ch);

/*********************** build output array ***********************/

$splatnet = array (
    'update' => time(),
    'rank' =>  array (
        array (
            'mode' => 'Splat Zones',
            'rank' => $ret_records['records']['player']['udemae_zones']['name'],
            'sp'   => $ret_records['records']['player']['udemae_zones']['s_plus_number']
        ),
        array (
            'mode' => 'Tower Control',
            'rank' => $ret_records['records']['player']['udemae_tower']['name'],
            'sp'   => $ret_records['records']['player']['udemae_tower']['s_plus_number']
        ),
        array (
            'mode' => 'Rainmaker',
            'rank' => $ret_records['records']['player']['udemae_rainmaker']['name'],
            'sp'   => $ret_records['records']['player']['udemae_rainmaker']['s_plus_number']
        ),
        array (
            'mode' => 'Clam Blitz',
            'rank' => $ret_records['records']['player']['udemae_clam']['name'],
            'sp'   => $ret_records['records']['player']['udemae_clam']['s_plus_number']
        )
    ),
    'battle' => array (
        'summary' => array (
            'win'    => $ret_results['summary']['victory_count'],
            'lose'   => $ret_results['summary']['defeat_count'],
            'sp'     => round($ret_results['summary']['special_count_average'] * 10) / 10,
            'kill'   => round($ret_results['summary']['kill_count_average'] * 10) / 10,
            'assist' => round($ret_results['summary']['assist_count_average'] * 10) / 10,
        ),
        'sp' => 'https://app.splatoon2.nintendo.net' . $ret_results['results'][0]['player_result']['player']['weapon']['special']['image_a'],
        'life' => array (
            'win'  => $ret_records['records']['win_count'],
            'lose' => $ret_records['records']['lose_count']
        )
    ),
    'league' => array (
        'team' =>  array (
            'gold'   => $ret_records['records']['league_stats']['team']['gold_count'],
            'sliver' => $ret_records['records']['league_stats']['team']['silver_count'],
            'bronze' => $ret_records['records']['league_stats']['team']['bronze_count'],
            'high'   => $ret_records['records']['player']['max_league_point_team']
        ),
        'pair' =>  array (
            'gold'   => $ret_records['records']['league_stats']['pair']['gold_count'],
            'sliver' => $ret_records['records']['league_stats']['pair']['silver_count'],
            'bronze' => $ret_records['records']['league_stats']['pair']['bronze_count'],
            'high'   => $ret_records['records']['player']['max_league_point_pair']
        )
    ),
    'hero' => array (
        'title' =>  $ret_hero['summary']['honor']['name'],
        'percent' => 1000
    ),
    'user' => array (
        'ign' => $ret_records['records']['player']['nickname'],
        'ico' => $ret_nick['nickname_and_icons'][0]['thumbnail_url'],
        'dc'  => $ret_records['records']['recent_disconnect_count'],
        'level' => array (
            'num'  => $ret_records['records']['player']['player_rank'],
            'star' => $ret_records['records']['player']['star_rank']
        ),
        'inks' => $ret_records['challenges']['total_paint_point']
    )
);

/*********************** output to JSON ***********************/

print_r(json_encode($splatnet, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
write_json($splatnet, '/../splatnet-data.json');

function write_json(array $json, string $file_path)
{
    $output_file = __DIR__.$file_path;
    touch($output_file);
    $fp = fopen($output_file, 'w');
    fwrite($fp, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fclose($fp);
}
