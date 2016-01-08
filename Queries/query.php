<?php

/**
 * Esta clase establece la conexión con la base de datos y extrae los valores
 *  necesarios para generar la capa.
 * Además se encarga de decidir dados sus parámetros que capa extraer(diferentes
 * geometrías)
 * Retorna un objeto JSON con los valores extraidos de la consulta
 * 
 */
class query {

    function conectar($host, $usr, $pass, $port, $db, $type, $name) {
        //conexión con la base de datos
        $strconn = "host=$host port=$port dbname=$db user=$usr password=$pass";
        $conn = pg_connect($strconn) or die('{"status":1 , "error":"Error de Conexion con la base de datos"}');
        //puntos
        if ($type == "p") {
            return "solicitó puntos";
        }
        //multilíneas
        else if ($type == "l") {
            return "Solicitó lineas";
        }
        //multipoligonos
        else if ($type == "mp") {
            return "solicitó multipoligonos";
        }
    }

}
