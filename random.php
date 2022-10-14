<?php

function random_choose(int $range) : int
{
    $list = range(0, $range - 1);
    shuffle($list);

    $key = mt_rand(0, $range - 1);

    return $list[$key];
}

function random_color_part() : string
{
    return str_pad( dechex( random_choose( 256 ) ), 2, '0', STR_PAD_LEFT);
}

function random_color() : string
{
    return random_color_part() . random_color_part() . random_color_part();
}

?>
