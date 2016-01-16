<?php

require './graficos.php';
//http://localhost/SegundoProyecto/trunk/Imgs/imagen.php?x=800&y=800&zi=0&mx=0&my=0&capa=hospitales&tipo=MULTIPOINT&conn=host=localhost%20port=5432%20dbname=cursoGIS%20user=postgres%20password=12345&rgb=[223, 24, 52]
header('Content-Type: image/png');


$x = $_GET['x'];
$y = $_GET['y'];
$zi = $_GET['zi'];
$mx = $_GET['mx'];
$my = $_GET['my'];
$capa = $_GET['capa'];
$type = $_GET['tipo'];
$conn = $_GET['conn'];
$rgb=$_GET['rgb'];
//print_r($conn);
$conn = pg_connect($conn) or die('{"status":1 , "error":"Error de Conexion con la base de datos"}');


$graficos = new graficos();
$img = $graficos->crearImagen($x, $y, $zi, $mx, $my, $capa, $type, $rgb, $conn);

echo imagepng($img);
imagedestroy($img);