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

        return queryForPoints($conn, $name);
    }

    /**
     * Funcion de retorna la informacion de las tablas
     * @param type $conn string de conexión
     * @return type JSON con los valores de nombre de la tabla, srid y tipo de todas las tablas
     */
    function getGeometryColumns($conn) {
        $respuesta = array();
        $query = "select f_table_name,srid, type from geometry_Columns";
        $result = pg_query($conn, $query) or die('{"status":1 , "error":"Error al obtener datos de las tablas (GeometryColumns)"}');
        while ($row = pg_fetch_row($result)) {
            $geometryColumns = array(
                "nombre" => $row[0],
                "srid" => $row[1],
                "tipo" => $row[2]
            );
            array_push($respuesta, $geometryColumns);
        }
        return json_encode($respuesta);
    }

}

/**
 * Funcion que devuelve un JSON con el SRID y las coordenadas de los puntos
 * necesarios para dibujar las capas compuestas por puntos
 * @param type $conn string de conexión
 * @param type $name nombre de la tabla a consultar
 * @return type JSON con los valores de las coordenadas del geom y el SRID de la
 * tabla
 */
function queryForPoints($conn, $name) {
    $respuesta = array();

    //obtener las geometrías x,y
    $query = "select st_asGeoJSON(geom) from $name";
    $result = pg_query($conn, $query) or die('{"status":1 , "error":"Error ern la consulta"}');
    while ($row = pg_fetch_row($result)) {
        $geom = array(
            "coordenada" => json_decode($row[0]));
        array_push($respuesta, $geom);
    }
    return $respuesta;
}
