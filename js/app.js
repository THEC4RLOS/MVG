//Controlador del visor
var myApp = angular.module('app', ['FBAngular']);

myApp.controller('controller', function ($scope, Fullscreen, $http, myService) {

    $scope.header = 'Conexion a Base de Datos';
    $scope.footer = '';
    $scope.host = 'localhost';
    $scope.port = 5432;
    $scope.db = 'cursoGIS';
    $scope.schema = 'public';
    $scope.user = 'postgres';
    $scope.pass = 12345;
    $scope.layers; // todas las caas disponibles    

    $scope.dim = ['300x300', '500x500', '700x700', '800x800', '900x900', '1000x1000'];
    $scope.selected = '300x300';
    $scope.dimension = 300;
    $scope.sizeX = $scope.dimension; //tamaño inicial de x
    $scope.sizeY = $scope.dimension; //tamaño inicial de y
    $scope.my = 0; //cantidad de peticiones de movimiento al eje y
    $scope.mx = 0; //cantidad de peticiones de movimiento al eje x
    $scope.zi = 0; //cantidad de peticiones al zoom
    $scope.imgUrl = "";
    $scope.lineLayers = Array();
    $scope.imgEnable = false; // variable para indicar si se ha activado el método de visualización img
    $scope.svgEnable = false; // variable para indicar si se ha activado el método de visualización svg
    $scope.canvasEnable = false; // variable para indicar si se ha activado el método de visualización canvas

    $scope.listo = false;//saber si las capas están listas para dibujarse

    $scope.layers = [];

    $scope.newx = 0;
    $scope.newy = 0;
    $scope.zoomx = 0;
    $scope.zoomy = 0;
    $scope.sizeCanvas = 0;


    $scope.update = function () {
        $scope.dimension = parseInt($scope.selected.substring(0, $scope.selected.indexOf("x")));
        $scope.sizeX = $scope.dimension; //tamaño inicial de x
        $scope.sizeY = $scope.dimension; //tamaño inicial de y 
        $scope.cambiarTam();
    };
    /**
     * Funcion para cambiar el tamaño del panel, actualiza las capas cuya visibilidad esté 
     * activada
     * @returns{undefined}
     */
    $scope.cambiarTam = function () {

        for (i = 0; i < $scope.layers.length; i++) {

            //si la capa actual tiene como estado visible, entonces actualizar
            //el tamaño de la imagen de acuerdo a las dimesiones
            if ($scope.layers[i].estado === true) {
                var color = "[" + $scope.layers[i].color + "]"; // variable para almacenar el arreglo del color de la capa como un string
                var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi + "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                var url = fun + "&conn=" + conn;
                $scope.layers[i].url = url;
            }
        }
    };

    /**
     * Función para solicitar las geometrías de las capas y controlar los métodos que las dibujan
     * @returns {undefined}
     */
    $scope.printGeometryColumns = function () {

        $scope.layers.forEach(function (layer) {

            if (layer.estado === true && layer.llamada === false) {
                var c1 = Math.floor(Math.random() * 255);
                var c2 = Math.floor(Math.random() * 255);
                var c3 = Math.floor(Math.random() * 255);
                layer.color = c1 + "," + c2 + "," + c3;
                var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                myService.async(layer.nombre, conn).then(function (data) {
                    $scope.data = data;
                    layer.puntos = data;
                    layer.cleanPoints = $scope.data; // puntos en limpio, sus valores no se cambiaran
                    layer.points = $scope.data;
                    layer.factor = false;
                    $scope.listo = true; // saber que se pueden solicitar las capas
                    if ($scope.canavasEnable === true)
                    {
                        $scope.drawByType(layer, false);
                    }
                    if ($scope.svgEnable === true)
                    {
                        $scope.drawSVGByType();
                    }
                });
                layer.llamada = true;
            }
        });
        if ($scope.imgEnable === true)
        {
            $scope.showImgs();
        }
    };

    $scope.canvasMov = function (op) {
        $scope.layers.forEach(function (layer) {
            $scope.drawByType(layer, op);
            $scope.drawSVGByType(layer);
        });
    };

    $scope.visualizarCanvas = function (op) {
        $scope.layers.forEach(function (layer) {
            $scope.drawByType(layer, op);
        });
    };

    /**
     * Función para seleccionar el método utilizado para dibujar la capa según su tipo
     * @param {object} layer
     * @param {bool} op
     */
    $scope.drawByType = function (layer, op) {
        $scope.canvasEnable = true;
        if (layer.tipo === "MULTIPOINT") {
            $scope.drawInCanvasPoints(layer, op);
        } else if (layer.tipo === "MULTIPOLYGON") {
            $scope.drawInCanvasPolygon(layer, op);
        } else if (layer.tipo === "MULTILINESTRING") {
            $scope.drawInCanvasLines(layer, op);
        }
    };


    $scope.drawInCanvasPoints = function (layer, op) {
        if (layer.estado === true && layer.llamada === true) {
            var cambiar = false;
            var canvas = document.getElementById(layer.nombre);
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, $scope.sizeX, $scope.sizeY);
            cambiar = layer.factor;

            layer.puntos.forEach(function (coordenada) {
                var x = coordenada[0];
                var y = coordenada[1];
                if (cambiar === false) {
                    x = Math.round((x - 283585.639702539) / (366468.447793805 / $scope.sizeY));
                    y = Math.round((y - 889378.554139937) / (366468.447793805 / $scope.sizeY));
                    y = $scope.sizeY - y;
                }
                x = x + Math.round($scope.sizeX * $scope.newx);
                y = y + Math.round($scope.sizeY * $scope.newy);
                if (op) {
                    x = (x + (x * $scope.zoomx));
                    y = (y + (y * $scope.zoomy));

                    if ($scope.zoomx > 0) {
                        x = x - (($scope.sizeX * 0.1) - (x * 0.1));
                        y = y - (($scope.sizeX * 0.1) - (y * 0.1));
                    } else {
                        x = x + (($scope.sizeX * 0.1) - (x * 0.1));
                        y = y + (($scope.sizeX * 0.1) - (y * 0.1));
                    }
                }
                coordenada[0] = x;
                coordenada[1] = y;
                context.beginPath();
                context.arc(x, y, 3, 0, 2 * Math.PI);
                context.fill();
                context.fillStyle = "rgb(" + layer.color + ")";
                //context.strokeStyle = "rgb(232,0,0)";
                //context.stroke();
            });
            if (layer.factor === false) {
                layer.factor = true;
            }
        }
    };

    /*
     * Función utilizada para asignar los puntos a dibujar al arreglo que controla el svg
     */
    $scope.drawSVGByType = function () {
        $scope.svgEnable = true; //activar el modo svg
        $scope.layers.forEach(function (layer) {
            if (layer.tipo === "MULTIPOINT") {
                $scope.drawSVGPoints(layer);
            }
            if (layer.tipo === "MULTILINESTRING") {

                $scope.drawInSVGLines(layer);
            } else if (layer.tipo === "MULTIPOLYGON") {
                $scope.drawInSVGPolygon(layer);
            }
        });

    };

    /*
     * Función que prepara el arreglo necesario para dibujar en svg
     * @param {type} layer capa a dibujar en svg
     * @returns {undefined}
     */
    $scope.drawSVGPoints = function (layer) {
        if (layer.estado === true && layer.llamada === true) {
            var cambiar = false;
            cambiar = layer.factor;

            layer.points.forEach(function (coordenada) {
                var x = coordenada[0];
                var y = coordenada[1];
                if (cambiar === false) {
                    x = Math.round((x - 283585.639702539) / (366468.447793805 / $scope.sizeY));
                    y = Math.round((y - 889378.554139937) / (366468.447793805 / $scope.sizeY));
                    y = $scope.sizeY - y;
                }
                x = x + Math.round($scope.sizeX * $scope.newx);
                y = y + Math.round($scope.sizeY * $scope.newy);
                //console.log(x, (x * $scope.newx), y, (y * $scope.newy));

                coordenada[0] = x;
                coordenada[1] = y;
                //console.log(coordenada[0], x, coordenada[1], y);                
                //context.strokeStyle = "rgb(232,0,0)";
                //context.stroke();
            });
            if (layer.factor === false) {
                layer.factor = true;
            }
        }
    };

    /**
     * Función que crea un string por cada registro 
     * @param {type} layer
     * @returns {undefined}
     */
    $scope.drawInSVGLines = function (layer) {

        layer.polyLines = Array();
        if (layer.estado === true && layer.llamada === true) {
            var cambiar = false;
            cambiar = layer.factor;

            for (i = 0; i < layer.puntos.length; i++) {
                var strPolyLine = "";
                if (layer.puntos[i] !== null) {

                    for (j = 0; j < layer.puntos[i].length; j++) {
                        //arreglo con las líneas necesarias para dibujar la capa en svg

                        var x = layer.puntos[i][j][0];
                        var y = layer.puntos[i][j][1];
                        //crear la capa de líneas en svg
                        if (cambiar === false) {
                            x = Math.round((x - 283585.639702539) / (366468.447793805 / $scope.sizeY));
                            y = Math.round((y - 889378.554139937) / (366468.447793805 / $scope.sizeY));
                            y = $scope.sizeY - y;
                        }
                        x = x + Math.round($scope.sizeX * $scope.newx);
                        y = y + Math.round($scope.sizeY * $scope.newy);

                        layer.puntos[i][j][0] = x;
                        layer.puntos[i][j][1] = y;

                        strPolyLine += x + "," + y + " ";

                    }
                    layer.polyLines.push(strPolyLine);
                }
            }
            if (layer.factor === false) {
                layer.factor = true;
            }
        }
    };

    $scope.drawInSVGPolygon = function (layer) {


        if (layer.estado === true && layer.llamada === true) {
            var cambiar = false;
            cambiar = layer.factor;
            for (i = 0; i < layer.puntos.length; i++) {

                for (j = 0; j < layer.puntos[i].length; j++) {
                    var x = layer.puntos[i][j][0];
                    var y = layer.puntos[i][j][1];
                    if (cambiar === false) {
                        x = Math.round((x - 283585.639702539) / (366468.447793805 / $scope.sizeY));
                        y = Math.round((y - 889378.554139937) / (366468.447793805 / $scope.sizeY));
                        y = $scope.sizeY - y;
                    }
                    x = x + Math.round($scope.sizeX * $scope.newx);
                    y = y + Math.round($scope.sizeY * $scope.newy);

                    layer.puntos[i][j][0] = x;
                    layer.puntos[i][j][1] = y;




                }

            }
            if (layer.factor === false) {
                layer.factor = true;
            }

        }
    };

    $scope.drawInCanvasLines = function (layer) {


        if (layer.estado === true && layer.llamada === true) {
            var cambiar = false;
            var canvas = document.getElementById(layer.nombre);
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, $scope.sizeX, $scope.sizeY);
            cambiar = layer.factor;

            for (i = 0; i < layer.puntos.length; i++) {

                if (layer.puntos[i] !== null) {
                    context.beginPath();

                    for (j = 0; j < layer.puntos[i].length; j++) {
                        //arreglo con las líneas necesarias para dibujar la capa en svg

                        var x = layer.puntos[i][j][0];
                        var y = layer.puntos[i][j][1];
                        //crear la capa de líneas en svg
                        if (cambiar === false) {
                            x = Math.round((x - 283585.639702539) / (366468.447793805 / $scope.sizeY));
                            y = Math.round((y - 889378.554139937) / (366468.447793805 / $scope.sizeY));
                            y = $scope.sizeY - y;
                        }
                        x = x + Math.round($scope.sizeX * $scope.newx);
                        y = y + Math.round($scope.sizeY * $scope.newy);

                        layer.puntos[i][j][0] = x;
                        layer.puntos[i][j][1] = y;


                        context.lineTo(x, y);
                        context.moveTo(x, y);

                    }

                    context.fill();
                    context.strokeStyle = "rgb(" + layer.color + ")";
                    context.stroke();
                }
            }
            if (layer.factor === false) {
                layer.factor = true;
            }
        }
    };

    /**
     * Funcion para dibujar en el canvas los poligonos y crear la estructura necesaria para dibujar
     * en los svg
     * @param {type} layer capa
     * @returns {undefined}
     */
    $scope.drawInCanvasPolygon = function (layer) {
        layer.polygon = Array();//arreglo de strings para dibujar los poligonos en svg
        if (layer.estado === true && layer.llamada === true) {
            var cambiar = false;
            var canvas = document.getElementById(layer.nombre);
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, $scope.sizeX, $scope.sizeY);
            cambiar = layer.factor;
            for (i = 0; i < layer.puntos.length; i++) {
                var strPolyLine = "";// string para almacenar los puntos de cada distrito, necesarios para dibujar el poligono en svg
                context.beginPath();
                for (j = 0; j < layer.puntos[i].length; j++) {
                    var x = layer.puntos[i][j][0];
                    var y = layer.puntos[i][j][1];
                    if (cambiar === false) {
                        x = Math.round((x - 283585.639702539) / (366468.447793805 / $scope.sizeY));
                        y = Math.round((y - 889378.554139937) / (366468.447793805 / $scope.sizeY));
                        y = $scope.sizeY - y;
                    }
                    x = x + Math.round($scope.sizeX * $scope.newx);
                    y = y + Math.round($scope.sizeY * $scope.newy);

                    layer.puntos[i][j][0] = x;
                    layer.puntos[i][j][1] = y;

                    strPolyLine += x + "," + y + " ";
                    context.lineTo(x, y);
                }
                layer.polygon.push(strPolyLine);
                context.fill();
                context.strokeStyle = "rgb(255,0,0)";
                context.stroke();
            }
            if (layer.factor === false) {
                layer.factor = true;
            }

        }
    };

    $scope.getGeometryColumns = function () {
        // Accion del boton Base de Datos

        var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
        var func = './Queries/request.php?func=getGeometryColumns&conn=';
        var url = func + conn;
        url += '&schema=' + $scope.schema;
        $http({method: 'GET', url: url}).
                then(
                        function (response)
                        {
                            $scope.layers = response.data;
                        }
                );
    };

    /*
     * Funcion encargada de conectar a la base de datos deseada
     */
    $scope.myRightButton = function () {
        // Accion del boton Base de Datos

        var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
        var func = './Queries/request.php?func=connect&conn=';
        var url = func + conn;
        $http({method: 'GET', url: url}).
                then(
                        function (response)
                        {
                            $scope.response = response;
                            if ($scope.response.data === 'ok') {
                                $scope.footer = 'Conexion exitosa';
                                $scope.getGeometryColumns();

                            } else {
                                $scope.footer = 'Error al conectar';
                            }
                        }
                );

    };

    $scope.goFullscreen = function () {
        if (Fullscreen.isEnabled())
            Fullscreen.cancel();
        else
            Fullscreen.all();
    };

    ////----------------------------------------------sección para las imgs
    $scope.showImgs = function () {
        $scope.imgEnable = true;
        for (i = 0; i < $scope.layers.length; i++) {

            if ($scope.layers[i].estado === true) {
                var color = "[" + $scope.layers[i].color + "]"; // variable para almacenar el arreglo del color de la capa como un string                   
                var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi + "&mx=" + $scope.mx +
                        "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                var url = fun + "&conn=" + conn;
                $scope.layers[i].url = url;

            }
        }
    };
    /*
     * Funcion para controlar la opcion de ocultar y mostrar una determinada capa
     * @param {type} id entero que además de ser id, funciona para representar la posicion
     * del objeto dentro del arreglo
     * @returns {undefined}
     */
    $scope.controlarVisualizacion = function (layer) {

        var id = $scope.layers.indexOf(layer);

        if ($scope.layers[id].estado === false) {
            $scope.layers[id].estado = true;
            if ($scope.imgEnable === true) {
                var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                //si es la primera vez que se muestran
                if ($scope.layers[id].url === "") {
                    //mostrar la capa requerida                       
                    var color = "[" + $scope.layers[id].color + "]"; // variable para almacenar el arreglo del color de la capa como un string
                    var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi +
                            "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                    var url = fun + "&conn=" + conn;
                    $scope.layers[id].url = url;

                } else if ($scope.layers[id].actualizar === true) {
                    var color = "[" + $scope.layers[id].color + "]"; // variable para almacenar el arreglo del color de la capa como un string
                    $scope.layers[id].actualizar = false;
                    var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi +
                            "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                    var url = fun + "&conn=" + conn;
                    $scope.layers[id].url = url;
                }
            }
        }

        //si se solicita un cambio en el estado de visualizacion y se sabe que
        // esta mostrandose entonces se oculta
        else {
            $scope.layers[id].estado = false;
        }
    };

    /**
     * Funcion para ordenar las capas, sube la capa dado su id y sube la capa que tenía el
     * lugar de la capa actual
     * @param {type}identificador que a la vez funciona como la posicion de la capa en el 
     * arrrreglo
     * @returns {undefined}
     */
    $scope.subir = function (layer) {
        var id = $scope.layers.indexOf(layer);
        if (id > 0) {
            var temp = $scope.layers[id - 1];
            $scope.layers[id - 1] = $scope.layers[id];
            $scope.layers[id] = temp;
        }

    };

    /**
     * Funcion para ordenar las capas, baja la capa dado su id y sube la capa que tenía el
     * lugar de la capa actual
     * @param {type} id identificador que a la vez funciona como la posicion de la capa en el 
     * arrrreglo
     * @returns {undefined}
     */
    $scope.bajar = function (layer) {

        var id = $scope.layers.indexOf(layer);
        if (id < $scope.layers.length - 1) {
            var temp = $scope.layers[id + 1];
            $scope.layers[id + 1] = $scope.layers[id];
            $scope.layers[id] = temp;
        }

    };

    /**
     * Funcion para aumentar la transparencia de una capa, dado su identificador
     * aumenta o disminuye en su estilo la opacidad de la misma
     * @param {type} layer objeto de la capa
     * @param {type} ind indicador de la accion a realizar (subir o bajar la tranparencia)
     * @returns {undefined}
     */
    $scope.aumentarTransparencia = function (layer, ind) {

        var id = $scope.layers.indexOf(layer);

        if (ind === 1 && $scope.layers[id].opacidad > 0) {
            $scope.layers[id].opacidad -= 0.1;
            //$scope.layers[id].url = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi + "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[id].nombre + "&tipo=" + $scope.layers[id].tipo;
        } else {
            if ($scope.layers[id].opacidad < 1) {
                $scope.layers[id].opacidad += 0.1;
            }

        }

    };
    /**
     * Funcion que suma y resta la cantidad de movientos a la izquierda que solicita el usuario
     * el movimiento se realiza en las coordenadas x,y
     * @param {type} ind indicador del movimiento que debe realizar la imagen
     * 
     * @returns {undefined}
     */
    $scope.mov = function (ind) {
        // realizar el movimiento de bajar la imagen en x
        // lo que da el efecto de que el visor se mueve hacia arriba

        if (ind === 0) {
            $scope.my += 1;
            $scope.newy = -0.1;
            $scope.newx = 0;
            $scope.canvasMov(false);
        }
        // realicar el movimiento de la imagen hacia arriba
        else if (ind === 1)
        {
            $scope.my -= 1;
            $scope.newy = 0.1;
            $scope.newx = 0;
            $scope.canvasMov(false);
        }
        //izquierda
        else if (ind === 3) {
            $scope.mx += 1;
            $scope.newx = -0.1;
            $scope.newy = 0;
            $scope.canvasMov(false);
        }
        //derecha
        else if (ind === 4) {
            $scope.mx -= 1;
            $scope.newx = 0.1;
            $scope.newy = 0;
            $scope.canvasMov(false);
        }
        if ($scope.imgEnable === true) {
            for (i = 0; i < $scope.layers.length; i++) {
                if ($scope.layers[i].estado === true) {
                    var color = "[" + $scope.layers[i].color + "]"; // variable para almacenar el arreglo del color de la capa como un string
                    var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                    var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi +
                            "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                    var url = fun + "&conn=" + conn;
                    $scope.layers[i].url = url;

                } else {
                    if ($scope.layers[i].url !== "") {
                        $scope.layers[i].actualizar = true; //variable necesaria para acutalizar en caso de 
                        //realizar algunos cambios y que la capa no esté disponible
                    }
                }
            }
        }
    };
    /**
     * Funcion para raalizar zoom, modifica dependiendo de su parametro el varlor
     * del zoom del visor y 
     * @param {type} ind indicador para saber si la operacion es de acercar,, alejar o resetear al zoom default
     * @returns {undefined}
     */

    $scope.zoomIn = function (ind) {

        if (ind === 1) {
            $scope.zi = $scope.zi + 1;
            $scope.zoomx = 0.1;
            $scope.zoomy = 0.1;
            $scope.canvasMov(true);
        } else if (ind === 0) {
            $scope.zi = $scope.zi - 1;
            $scope.zoomx = -0.1;
            $scope.zoomy = -0.1;
            $scope.canvasMov(true);
        } else {
            $scope.zi = 0;
            $scope.zoomx = 0;
            $scope.zoomy = 0;
        }
        if ($scope.imgEnable === true) {
            for (i = 0; i < $scope.layers.length; i++) {
                if ($scope.layers[i].estado === true) {
                    var color = "[" + $scope.layers[i].color + "]"; // variable para almacenar el arreglo del color de la capa como un string
                    var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                    var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi +
                            "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                    var url = fun + "&conn=" + conn;
                    $scope.layers[i].url = url;
                } else {
                    if ($scope.layers[i].url !== "") {
                        $scope.layers[i].actualizar = true;
                    }
                }
            }
        }
    };
    /*
     * Funcion para enfocar la capa seleccionada
     * recibe la capa a enfocar
     */
    $scope.enfocar = function (layer) {

        var id = $scope.layers.indexOf(layer);

        var temp = $scope.layers[id];
        $scope.layers[id] = $scope.layers[$scope.layers.length - 1];
        $scope.layers[$scope.layers.length - 1] = temp;
        $scope.zi = -1;
        if ($scope.imgEnable === true) {
            for (i = 0; i < $scope.layers.length; i++) {
                //si la capa actual tiene como estado visible, entonces actualizar
                //el tamaño de la imagen de acuerdo a las dimesiones
                if ($scope.layers[i].estado === true) {
                    var color = "[" + $scope.layers[i].color + "]"; // variable para almacenar el arreglo del color de la capa como un string
                    var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                    var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi +
                            "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                    var url = fun + "&conn=" + conn;
                    $scope.layers[i].url = url;
                }
            }
        }
    };

    ///funciones de svg------------------------------------------------------

});
myApp.directive('modal', function () {
    return {
        restrict: 'EA',
        scope: {
            title: '=modalTitle',
            header: '=modalHeader',
            body: '=modalBody',
            footer: '=modalFooter',
            callbackbuttonleft: '&ngClickLeftButton',
            callbackbuttonright: '&ngClickRightButton',
            handler: '=lolo',
            host: '=host',
            port: '=port',
            db: '=db',
            user: '=user',
            pass: '=pass',
            schema: '=schema'
        },
        templateUrl: './view/modal_dbConnect.html',
        transclude: true,
        controller: function ($scope) {
            $scope.handler = 'pop';
        }
    };
});
myApp.factory('myService', function ($http) {
    var myService = {
        async: function (name, conn) {
            //var points = [];
            //var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
            var func = './Queries/request.php?func=getPoints&conn=';
            var url = func + conn;
            url += "&name=" + name;
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(url).then(function (response) {
                // The then function here is an opportunity to modify the response
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return myService;
});
