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
    $scope.SVGLayers = Array();

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

    $scope.layers = [];
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
                var color = "[" + $scope.layers[i].color.toString() + "]"; // variable para almacenar el arreglo del color de la capa como un string
                var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi + "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                var url = fun + "&conn=" + conn;
                $scope.layers[i].url = url;

            }
        }

    };
    $scope.printGeometryColumns = function () {

        $scope.layers.forEach(function (layer) {

            if (layer.estado === true && layer.llamada === false) {
                var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                myService.async(layer.nombre, conn).then(function (data) {
                    $scope.data = data;
                    layer.puntos = data;
                    //console.log('data:', $scope.data);
                    $scope.drawByType(layer, 0, 0);

                    $scope.SVGLayers.push(layer);
                });
                layer.llamada = true;
            }
        });
        $scope.showImgs();
    };

    $scope.canvasMov = function (newx, newy) {

        $scope.layers.forEach(function (layer) {
            $scope.drawByType(layer, newx, newy);
        });
    };

    /**
     * Función para seleccionar el método utilizado para dibujar la capa según su tipo
     */

    $scope.drawByType = function (layer, newx, newy) {
        if (layer.tipo === "MULTIPOINT") {
            $scope.drawInCanvasPoints(layer, newx, newy);
        } else if (layer.tipo === "MULTIPOLYGON") {
            $scope.drawInCanvasPolygon(layer, newx, newy);
        } else if (layer.tipo === "MULTILINESTRING") {
            $scope.drawInCanvasLines(layer, newx, newy);
        }
    };

    $scope.drawInCanvasPoints = function (layer, newx, newy) {
        if (layer.estado === true && layer.llamada === true) {
            var canvas = document.getElementById(layer.nombre);
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, $scope.sizeX, $scope.sizeY);
            layer.color = JSON.parse(layer.color);

            layer.puntos.forEach(function (coordenada) {
                var x = (coordenada[0]);
                var y = (coordenada[1]);

                x = Math.round((x - 283585.639702539) / (366468.447793805 / $scope.sizeY));
                y = Math.round((y - 889378.554139937) / (366468.447793805 / $scope.sizeY));
                x = x + ((x * 0.1) * newx);
                y = $scope.sizeY - y;
                y = y + ((y * 0.1) * newy);
                context.beginPath();
                context.arc(x, y, 3, 0, 2 * Math.PI);
                context.fill();

                context.fillStyle = "rgb(" + layer.color[0] + "," + layer.color[1] + "," + layer.color[2] + ")";
                //context.strokeStyle = "rgb(232,0,0)";
                //context.stroke();
            });
        }
    };


    $scope.drawInCanvasLines = function (layer, newx, newy) {
        //console.log(layer);
       layer.color = JSON.parse(layer.color);
       layer.polyLines = Array();
        if (layer.estado === true && layer.llamada === true) {
            
            var canvas = document.getElementById(layer.nombre);
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, $scope.sizeX, $scope.sizeY);
            for (i = 0; i < layer.puntos.length; i++) {
                var strPolyLine = "";
                if (layer.puntos[i] !== null) {
                    context.beginPath();

                    for (j = 0; j < layer.puntos[i].length; j++) {                                                                                             
                        //arreglo con las líneas necesarias para dibujar la capa en svg
                        //registro.push(linea);

                        var x = layer.puntos[i][j][0];
                        var y = layer.puntos[i][j][1];
                        //crear la capa de líneas en svg
                        
                        x = Math.round((x - 283585.639702539) / (366468.447793805 / $scope.sizeY));
                        y = Math.round((y - 889378.554139937) / (366468.447793805 / $scope.sizeY));
                        x = x + (x*0.1)*newx;
                        y = $scope.sizeY - y;
                        strPolyLine+=x+","+y+" ";                        
                       context.lineTo(x, y);
                       context.moveTo(x, y);

                    }
                    layer.polyLines.push(strPolyLine);                    
                    context.fill();                    
                    context.strokeStyle = "rgb(" + layer.color[0] + "," + layer.color[1] + "," + layer.color[2] + ")";
                    context.stroke();
                }
            }
           
            layer.rgb=layer.color[0]+", "+layer.color[1]+", "+layer.color[2];            
        }
    };

    $scope.drawInCanvasPolygon = function (layer) {
        if (layer.estado === true && layer.llamada === true) {
            layer.puntos.forEach(function (registro) {
                var canvas = document.getElementById(layer.nombre);
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, $scope.sizeX, $scope.sizeY);
                context.beginPath();
                registro.forEach(function (coordenada) {
                    var x = coordenada[0];
                    var y = coordenada[1];
                    x = 10 + Math.round((x - 340735.03802508) / 430.145515478705);
                    y = Math.round((y - 955392.16848899) / 430.145515478705);
                    y = $scope.sizeY - y;
                    context.lineTo(x, y);
                });
                context.fill();
                context.strokeStyle = "rgb(255,0,0)";
                context.stroke();
            });
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
                            console.log($scope.layers);
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
        console.log("conexion\n" + url);
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

        for (i = 0; i < $scope.layers.length; i++) {

            if ($scope.layers[i].estado === true) {
                var color = "[" + $scope.layers[i].color.toString() + "]"; // variable para almacenar el arreglo del color de la capa como un string
                var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi + "&mx=" + $scope.mx +
                        "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                var url = fun + "&conn=" + conn;
                $scope.layers[i].url = url;
                //console.log(url);

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
            var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
            //si es la primera vez que se muestran
            if ($scope.layers[id].url === "") {
                //mostrar la capa requerida                       
                var color = "[" + $scope.layers[id].color.toString() + "]"; // variable para almacenar el arreglo del color de la capa como un string
                var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi +
                        "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                var url = fun + "&conn=" + conn;
                $scope.layers[id].url = url;

            } else if ($scope.layers[id].actualizar === true) {
                var color = "[" + $scope.layers[id].color.toString() + "]"; // variable para almacenar el arreglo del color de la capa como un string
                $scope.layers[id].actualizar = false;
                var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi +
                        "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                var url = fun + "&conn=" + conn;
                $scope.layers[id].url = url;
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
            $scope.canvasMov(0, 1);
        }
        // realicar el movimiento de la imagen hacia arriba
        else if (ind === 1)
        {
            $scope.my -= 1;
            $scope.canvasMov(0, -1);
        }

        //izquierda
        else if (ind === 3) {
            $scope.mx += 1;
            $scope.canvasMov(1, 0);
        }
        //derecha
        else if (ind === 4) {
            $scope.mx -= 1;
            $scope.canvasMov(-1, 0);
        }
        for (i = 0; i < $scope.layers.length; i++) {
            if ($scope.layers[i].estado === true) {
                var color = "[" + $scope.layers[i].color.toString() + "]"; // variable para almacenar el arreglo del color de la capa como un string
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
        } else if (ind === 0) {
            $scope.zi = $scope.zi - 1;
        } else {
            $scope.zi = 0;
        }
        for (i = 0; i < $scope.layers.length; i++) {
            if ($scope.layers[i].estado === true) {
                var color = "[" + $scope.layers[i].color.toString() + "]"; // variable para almacenar el arreglo del color de la capa como un string
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

        for (i = 0; i < $scope.layers.length; i++) {
            //si la capa actual tiene como estado visible, entonces actualizar
            //el tamaño de la imagen de acuerdo a las dimesiones
            if ($scope.layers[i].estado === true) {
                var color = "[" + $scope.layers[i].color.toString() + "]"; // variable para almacenar el arreglo del color de la capa como un string
                var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi +
                        "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo + "&rgb=" + color;
                var url = fun + "&conn=" + conn;
                $scope.layers[i].url = url;
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
                //console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return myService;
});
