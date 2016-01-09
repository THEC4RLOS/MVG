<?php
/**
 * Verificar que la conexión sea correcta
 */
class Checker{
    function connect($host, $usr, $pass, $port, $db){
        //conexión con la base de datos
        $strconn = "host=$host port=$port dbname=$db user=$usr password=$pass";
        $conn = pg_connect($strconn) or die('{"status":1 , "error":"Error de Conexion con la base de datos"}');
        echo "ok"; // si la conexión es exitosa
    }
}