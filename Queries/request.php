<?php
/**
 * Archivo que recibe la petición de realizar la consulta y conexión con la 
 * base de datos, este realiza la petición dados los parámetros de conexión
 * llamando al metodo conexión del archivo Query.php
 */
require './query.php';
//http://localhost/MVG/trunk/Queries/request.php?h=localhost&u=postgres&p=12345&port=4321&db=cursoGIS&name=hospitales&type=p


//datos para la conexión
$host = $_GET['h']; // host de la base de datos
$user = $_GET['u']; // nombre de usuario
$pass = $_GET['p']; // contraseña de usuario
$port = $_GET['port']; //puerto
$db = $_GET['db']; // nombre de la base de datos

//datos para realizar la consulta
$name = $_GET['name']; // nombre de la tabla a consultar
$type = $_GET['type']; //tipo de geometría de la tabla

$query = new query();
$layer = $query->conectar($host,$user,$pass,$port,$db,$type,$name);

echo $layer;
