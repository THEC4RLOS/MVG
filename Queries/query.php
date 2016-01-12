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
        $query = "select st_asGeoJSON(geom) from $name limit 5";
        $result = pg_query($conn, $query) or die('{"status":1 , "error":"Error al obtener los puntos (Points)"}');
        $row = pg_fetch_all($result);

        foreach ($row as &$valor) { // puntos MultiPoint
            //print_r($valor['st_asgeojson']);
            $data = substr($valor['st_asgeojson'], strrpos($valor['st_asgeojson'], 'coordinates', 0) + strlen('coordinates') + 2, -1);
            $lines = strrpos($valor['st_asgeojson'], 'MultiLineString', 0);
            $polygon = strrpos($valor['st_asgeojson'], 'MultiPolygon', 0);
            $jsonData = json_decode($data);
            
            if ($polygon == '' and $lines == '') {
                array_push($respuesta, $jsonData[0]);
                //print_r($as[0]);
            } else {
                foreach ($jsonData[0] as &$valor2) { // lineas MultiLineString
                    if ($polygon == '') {
                        array_push($respuesta, $valor2);
                        //print_r($valor2);
                    } else {
                        foreach ($valor2 as &$valor3) { // poligonos MultiPolygon
                            array_push($respuesta, $valor3);
                            //print_r($valor3);
                        }
                    }
                }
            }
        }
        return $respuesta;
    }
    
}
