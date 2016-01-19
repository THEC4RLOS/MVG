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
    function getGeometryColumns($conn, $schema) {
        $respuesta = array();
        $query = "select f_table_schema, f_table_name, srid, type, 'false' estado, '[]' puntos, 'false' llamada from geometry_Columns where f_table_schema = '$schema'";
        $result = pg_query($conn, $query) or die('{"status":1 , "error":"Error al obtener datos de las tablas (GeometryColumns)"}');
        while ($row = pg_fetch_row($result)) {
            //colores aleatorios
            $r = rand(0, 255);
            $g = rand(0, 150);
            $b = rand(0, 200);
            
            $geometryColumns = array(
                "esquema" => $row[0],
                "nombre" => $row[1],
                "srid" => $row[2],
                "tipo" => $row[3],
                "estado" => json_decode($row[4]), // cheched en la interfaz
                "puntos" => json_decode($row[5]),
                "llamada" => json_decode($row[6]), // si ya se hizo la llamada para obtener los puntos
                "opacidad" => 1,
                "actualizar" => false,
                "color" => json_encode(array($r,$g,$b)),
                "lineas" => array()
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
        $registro = array();
        //obtener las geometrías x,y
        $query = "select st_asGEOJSON(geom) from $name";
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
                //foreach ($jsonData[0] as &$valor2) { // lineas MultiLineString
                if ($polygon == '') {
                    array_push($respuesta, $jsonData[0]);
                    // print_r($jsonData[0]);
                    //echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';
                } else {
                    //foreach ($valor2 as &$valor3) { // poligonos MultiPolygon
                    array_push($respuesta, $jsonData[0][0]);
                    //print_r($valor3);
                    //}
                }
                //print_r($jsonData[0]);
                //echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';
                //}
            }
        }
        //return null;
        return $respuesta;

        //print_r($respuesta);
    }

}
