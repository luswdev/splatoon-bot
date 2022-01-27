<?php

include __DIR__.'/../vendor/autoload.php';
include __DIR__.'/random.php';
include __DIR__.'/weapon_list.php';
include __DIR__.'/map_list.php';
include __DIR__.'/bot.php';

use Discord\Discord;
use Discord\Builders\MessageBuilder;
use Discord\Parts\Embed\Embed;
use Discord\Parts\User\Activity;

$discord = new Discord([
    'token' => $BOT_TOKEN,
]);

$discord->on('ready', function ($discord) {
    echo "Bot is ready!", PHP_EOL;

    $act = new Activity($discord);
    $act->type = 0;
    $act->name = 'Splatoon 2 | ?help';
    $act->url = 'https://lusw.dev/splatoon';
    $discord->updatePresence($act, false, 'online', false);

    // Listen for messages.
    $discord->on('message', function ($message, $discord) {
        $message_ascii = mb_convert_kana($message->content, 'rnaskhc', 'UTF-8');
        $img_url_base = 'https://raw.githubusercontent.com/luswdev/SplatoonBot/master/img/';

        if (strcasecmp("?rw", $message_ascii) === 0) {
            global $weapons;
            $key = random_choose(count($weapons['en']));
            $check = ':small_blue_diamond:';

            $embed = new Embed($discord);
            $embed->setTitle('Random Weapon!!');
            $embed->setImage($img_url_base.'weapon/weapon_'.$key.'.png');
            $embed->setColor(random_color());
            $embed->setDescription($check.' '.$weapons['en'][$key].PHP_EOL.
                                   $check.' '.$weapons['jp'][$key].PHP_EOL.
                                   $check.' '.$weapons['zh'][$key]);
            $embed->setFooter('Requested by '.$message->user->username, $message->user->avatar);
            $embed->setTimestamp(time());

            $message->channel->sendMessage(MessageBuilder::new()->addEmbed($embed));
        } else if (strcasecmp("?rm", $message_ascii) === 0) {
            global $maps;
            $key = random_choose(count($maps['en']));
            $check = ':small_blue_diamond:';

            $embed = new Embed($discord);
            $embed->setTitle('Random Map!!');
            $embed->setImage($img_url_base.'map/map_'.$key.'.png');
            $embed->setColor(random_color());
            $embed->setDescription($check.' '.$maps['en'][$key].PHP_EOL.
                                   $check.' '.$maps['jp'][$key].PHP_EOL.
                                   $check.' '.$maps['zh'][$key]);
            $embed->setFooter('Requested by '.$message->user->username, $message->user->avatar);
            $embed->setTimestamp(time());

            $message->channel->sendMessage(MessageBuilder::new()->addEmbed($embed));
        } else if  (strcasecmp("?help", $message_ascii) === 0) {
            $embed = new Embed($discord);
            $embed->setTitle('Help Manual');
            $embed->setDescription('A simple bot for Splatoon 2.'.PHP_EOL.
                                   'Visit website: https://lusw.dev/splatoon/'.PHP_EOL.PHP_EOL.
                                   '**Commands:**'.PHP_EOL.
                                   '`?rw` Random choose a weapon.'.PHP_EOL.
                                   '`?rm` Random choose a map.'.PHP_EOL);
            $embed->setColor(random_color());
            $embed->setFooter('Requested by '.$message->user->username, $message->user->avatar);
            $embed->setTimestamp(time());

            $message->channel->sendMessage(MessageBuilder::new()->addEmbed($embed));
        } else if  (strcasecmp("?close", $message_ascii) === 0) {
            $admins = $ADMINS;
            foreach ($admins as $admin) {
                if ($message->user->id === $admin) {
                    $embed = new Embed($discord);
                    $embed->setTitle('System Operation');
                    $embed->setDescription('Close bot by admin: '.$message->user->username);
                    $embed->setColor(random_color());
                    $embed->setFooter('Requested by '.$message->user->username, $message->user->avatar);
                    $embed->setTimestamp(time());
        
                    $message->channel->sendMessage(MessageBuilder::new()->addEmbed($embed));
        
                    $act = new Activity($discord);
                    $act->type = 0;
                    $act->name = '';
                    $act->url = '';
                    $discord->updatePresence($act, false, 'invisible', false);
        
                    $discord->close(false);
                }
            }
        }
    });
});

$discord->run();

?>
