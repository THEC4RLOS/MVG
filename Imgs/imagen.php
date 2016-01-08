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
$X1 = $_GET['x1'];
$Y1 = $_GET['y1'];
$X2 = $_GET['x2'];
$Y2 = $_GET['y2'];
$filas = $_GET['filas'];
$columnas = $_GET['columnas'];

$graficos = new graficos();
$img = $graficos->crearImagen($x, $y, $zi, $mx, $my, $capa, $type, $X1, $Y1, $X2, $Y2, $filas, $columnas);

echo imagepng($img);
//imagedestroy($img);