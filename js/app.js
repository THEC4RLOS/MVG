//Controlador del visor
var myApp = angular.module('app', ['FBAngular']);

myApp.controller('controller', function ($scope, Fullscreen, $http) {

    
    $scope.header = 'Conexion a Base de Datos';
    $scope.footer = '';
    $scope.host = 'localhost';
    $scope.port = 5432;
    $scope.db = 'cursoGIS';
    $scope.schema = 'schema';
    $scope.user = 'postgres';
    $scope.pass = 12345;
    $scope.layers; // todas las caas disponibles

    $scope.dim = ['300x300', '500x500', '700x700', '800x800', '900x900', '1000x1000'];
    $scope.selected = '300x300';
    $scope.dimension = 300;
    $scope.sizeX = $scope.dimension; //tamaño inicial de x
    $scope.sizeY = $scope.dimension; //tamaño inicial de y
    $scope.capas = [];
    $scope.update = function () {
        $scope.dimension = parseInt($scope.selected.substring(0, $scope.selected.indexOf("x")));
        $scope.sizeX = $scope.dimension; //tamaño inicial de x
        $scope.sizeY = $scope.dimension; //tamaño inicial de y 
        $scope.cambiarTam();
        //console.log($scope.dimension);
    };


    $scope.printGeometryColumns = function () {
        var i = 0;
        $scope.layers.forEach(function (layer) {

            //console.log('nombre:', layer.nombre, 'estado:', layer.estado);
            if (layer.estado === true && layer.llamada === false) {
                layer.puntos = $scope.getPoints(layer.nombre);
                layer.llamada = true;
                
            }
        });

    };

    $scope.visualizarCanvas = function () {
        $scope.capas.forEach(function (value)
        {
            var capa = {
                    nombre: layer.nombre, //nombre de la capa
                    prioridad: i, // prioridad de la capa
                    visible: false, // visible u opculto
                    url: "", // dirección para crear la imagen
                    actualizar: false,
                    opacidad: 1
                };
                $scope.capas.push(capa);
                i++;
            var canvas = document.getElementById(value.nombre);
            var context = canvas.getContext('2d');
            value.puntos.forEach(function (val)
            {
                var x = value.coordenada.coordinates[0][0];
                var y = value.coordenada.coordinates[0][1];
                x = 10 + Math.round((x - $scope.hospitales.data.Dimensiones.xmin) / $scope.factorProporcional);
                y = 10 + Math.round((y - $scope.hospitales.data.Dimensiones.ymin) / $scope.factorProporcional);
                y = $scope.canvasY - y;
                context.moveTo(x - 5, y);
                context.lineTo(x + 5, y);
                context.moveTo(x, y - 5);
                context.lineTo(x, y + 5);
                context.strokeStyle = "rgb(255,0,0)";
                context.stroke();
            });
        });

    };

    $scope.getGeometryColumns = function () {
        // Accion del boton Base de Datos

        var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
        var func = './Queries/request.php?func=getGeometryColumns&conn=';
        var url = func + conn;
        //console.log(url);
        $http({method: 'GET', url: url}).
                then(
                        function (response)
                        {
                            // $scope.response = response;
                            $scope.layers = response.data;
                            //console.log(response);
                            //if ($scope.response.data === 'ok') {
                            // $scope.footer = 'Conexion exitosa';

                            //} else {
                            //$scope.footer = 'Error al conectar';
                            //}
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
        //console.log(url);
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




    //--------------------------------------------------------------------------
//    $scope.hospitales = Array();
//    $scope.arrayToSend = Array();
//    var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass + '&name=hospitales';
//    var func = './Queries/request.php?func=getPoints&conn=';
//    var url = func + conn;
//    //console.log(url);
    $scope.getPoints = function (name) {

        var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
        var func = './Queries/request.php?func=getPoints&conn=';
        var url = func + conn;
        url += "&name=" + name;
        $http({method: 'GET', url: url}).
                then(function (response) {
                    return response.data;
//                    $scope.layers.puntos = response.data;
//                    console.log(response.data);
                });
    };


//    $scope.sendArray = function (arreglot) {
//
//        $.ajax({
//            type: "POST",
//            url: "receptor.php",
//            data: {array: JSON.stringify(arreglot)},
//            success: function (data) {
//                console.log(data);
//
//            }, error: function () {
//                console.log("ErrroRRRRSAAURIO!");
//            }
//        });
//
//    };

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
