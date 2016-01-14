<?php
/**
 * Archivo que recibe la petición de realizar la consulta y conexión con la 
 * base de datos, este realiza la petición dados los parámetros de conexión
 * llamando al metodo conexión del archivo Query.php
 */
require './query.php';

$func = $_GET['func'];
$conn = $_GET['conn'];

if ($func == 'getGeometryColumns') {
    $schema = $_GET['schema'];
    //http://localhost:8080/mvg/trunk/Queries/request.php?func=getGeometryColumns&conn=host=localhost%20port=5432%20dbname=cursoGIS%20user=postgres%20password=12345
    $conn = pg_connect($conn) or die('{"status":1 , "error":"Error de Conexion con la base de datos"}');
    $query = new query();
    $geometryColumns = $query->getGeometryColumns($conn, $schema);
    //print_r($geometryColumns);
    echo json_encode($geometryColumns);
    
} else if ($func == 'getPoints') {
    //http://localhost:8080/mvg/trunk/Queries/request.php?func=getPoints&conn=host=localhost%20port=5432%20dbname=cursoGIS%20user=postgres%20password=12345&name=hospitales
    $name = $_GET['name']; // nombre de la tabla a consultar
    $conn = pg_connect($conn) or die('{"status":1 , "error":"Error de Conexion con la base de datos"}');
    $query = new query();
    $points = $query->getPoints($conn, $name);
    //print_r($points);
    echo json_encode($points);
    
} else if ($func == 'connect') {
    //http://localhost:8080/mvg/trunk/Queries/request.php?func=connect&conn=host=localhost%20port=5432%20dbname=cursoGIS%20user=postgres%20password=12345
    $state = pg_connect($conn) or die('{"status":1 , "error":"Error de Conexion con la base de datos"}');
    echo "ok"; // si la conexión es exitosa
    
}