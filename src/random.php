<?php

function random_choose(int $range) : int
{
    $list = range(0, $range - 1);
    shuffle($list);

    $key = rand(0, $range - 1);

    return $list[$key];
}

function random_color_part() {
    return str_pad( dechex( mt_rand( 0, 255 ) ), 2, '0', STR_PAD_LEFT);
}

function random_color() {
    return random_color_part() . random_color_part() . random_color_part();
}

