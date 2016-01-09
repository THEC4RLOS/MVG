<?php

/**
 *  Clase donde se encuentra todas las funciones
 * Retorna un objeto JSON con los valores extraidos de la consulta
 * 
 */
class query {

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

    /**
     * Funcion que devuelve un JSON con el SRID y las coordenadas de los puntos
     * necesarios para dibujar las capas compuestas por puntos
     * @param type $conn string de conexión
     * @param type $name nombre de la tabla a consultar
     * @return type JSON con los valores de las coordenadas del geom y el SRID de la
     * tabla
     */
    function getPoints($conn, $name) {
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

    /**
     * 
     * @param type $host
     * @param type $usr
     * @param type $pass
     * @param type $port
     * @param type $db
     */
    function connect($strconn) {
        //conexión con la base de datos
        $conn = pg_connect($strconn) or die('{"status":1 , "error":"Error de Conexion con la base de datos"}');
        echo "ok"; // si la conexión es exitosa
    }

}
