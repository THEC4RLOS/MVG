<?php

require './graficos.php';
//http://localhost/GIS/imagen.php?x=1024&y=1024&zi=0.1&mx=2&my=2
header('Content-Type: image/png');


$x = $_GET['x'];
$y = $_GET['y'];
$zi = $_GET['zi'];
$mx = $_GET['mx'];
$my = $_GET['my'];
$capa = $_GET['capa'];
$type = $_GET['tipo'];


$graficos = new graficos();
$img = $graficos->crearImagen($x, $y, $zi, $mx, $my, $capa, $type);

echo imagepng($img);
imagedestroy($img);