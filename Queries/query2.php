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
        $query = "select f_table_name, srid, type, 'false' estado, '[]' puntos, 'false' llamada from geometry_Columns where srid = 5367";
        $result = pg_query($conn, $query) or die('{"status":1 , "error":"Error al obtener datos de las tablas (GeometryColumns)"}');
        while ($row = pg_fetch_row($result)) {
            $geometryColumns = array(
                "nombre" => $row[0],
                "srid" => $row[1],
                "tipo" => $row[2],
                "estado" => json_decode($row[3]),
                "puntos" => json_decode($row[4]),
                "llamada" => json_decode($row[5])
            );
            array_push($respuesta, $geometryColumns);
        }
        return $respuesta;
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
        $query = "select st_asGeoJSON(geom) from distritos";
        $result = pg_query($conn, $query) or die('{"status":1 , "error":"Error ern la consulta"}');
        $row = pg_fetch_all($result);

        foreach ($row as &$valor) { // puntos
            //echo strrpos($valor['st_asgeojson'], 'coordinates', 0);

            $d = substr($valor['st_asgeojson'], strrpos($valor['st_asgeojson'], 'coordinates', 0) + strlen('coordinates') + 2, -1);

            //echo ($valor['st_asgeojson']);
            $as = json_decode($d);
            //print_r($as[0]);
            foreach ($as[0] as &$valor2) { // lineas

                foreach ($valor2 as &$valor3) { // poligonos
                    print_r($valor3);
                    echo '<br>';
                    echo '<br>';
                    echo '<br>';
                    echo '<br>';
                    echo '<br>';
                }
            }
        }
        /* while ($row = pg_fetch_row($result)) {
          $geom = array(
          $row[0]);
          array_push($respuesta, $geom);
          } */
        //print_r($row);
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
