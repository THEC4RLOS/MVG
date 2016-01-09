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

    /**
     * Función que decide cual tipo de consulta realizar y prepara el string de
     * conexión a la base de datos
     * @param type $host host de la base de datos
     * @param type $usr usuario de la base de datos
     * @param type $pass contraseña
     * @param type $port puierto
     * @param type $db nombre base de datos
     * @param type $type tipo de geometría de la capa solicitada
     * @param type $name nombre de la tabla solicitada
     * @return string Objeto con los datos necesarios para crear la capa
     */
    function conect($host, $usr, $pass, $port, $db, $type, $name) {
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

function queryForPoints($conn, $type, $name) {
    $respuesta = array();
    
    //obtener las geometrías x,y
    $query = "select st_asGeoJSON(geom) from hospitales";
    $result = pg_query($conn, $query) or die('{"status":1 , "error":"Error ern la consulta"}');    
    while ($row = pg_fetch_row($result)) {
        $geom = array(
            "coordenada" => json_decode($row[0]));
        array_push($respuesta, $geom);
    }
    
    // seleccionar factores mínimos y máximos
    $query = "select 	min(ST_XMin(geom)) xmin,
	max(ST_XMax(geom)) xmax,
	min(ST_yMin(geom)) ymin,
	max(ST_yMax(geom)) ymax from hoteles";

    $result = pg_query($conn, $query) or die('{"status":1 , "error":"Error ern la consulta"}');
    $row = pg_fetch_row($result);
    $dimensiones = array
        (
        "xmin" => $row[0],
        "xmax" => $row[1],
        "ymin" => $row[2],
        "ymax" => $row[3]
    );

    $query = "select srid,type from geometry_Columns where \"f_table_name\"='hoteles'";

    $result = pg_query($conn, $query) or die('{"status":1 , "error":"Error ern la consulta"}');
    $row = pg_fetch_row($result);

    echo json_encode(array("SRID" => $row[0],
        "Tipo" => $row[1],
        "Dimensiones" => $dimensiones,
        "objs" => $respuesta));
}
