<?php

/**
 * Archivo que recibe la petición de realizar la consulta y conexión con la 
 * base de datos, este realiza la petición dados los parámetros de conexión
 * llamando al metodo conexión del archivo Query.php
 */
require './query.php';
require './connexion.php';
//http://localhost/MVG/trunk/Queries/request.php?h=localhost&u=postgres&p=12345&port=5432&db=cursoGIS&name=hospitales&type=mp
//datos para la conexión
$host = $_GET['h']; // host de la base de datos
$user = $_GET['u']; // nombre de usuario
$pass = $_GET['p']; // contraseña de usuario
$port = $_GET['port']; //puerto
$db = $_GET['db']; // nombre de la base de datos
//datos para realizar la consulta
$name = $_GET['name']; // nombre de la tabla a consultar
$type = $_GET['type']; //tipo de geometría de la tabla

if ($name != NULL && $type != NULL) {
    $query = new query();
    $layer = $query->conect($host, $user, $pass, $port, $db, $type, $name);
    print_r( $layer);
    return $layer[0];
}
//http://localhost/MVG/trunk/Queries/request.php?h=localhost&u=postgres&p=12345&port=532&db=cursoGIS&name&type
else {
    $checker = new Checker();
    $conn = $checker->connect($host, $user, $pass, $port, $db);
    echo $conn;
}

