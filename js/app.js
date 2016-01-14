//Controlador del visor
var myApp = angular.module('app', ['FBAngular']);

myApp.controller('controller', function ($scope, Fullscreen, $http, myService) {

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
    $scope.dimension = 600;
    $scope.sizeX = $scope.dimension; //tamaño inicial de x
    $scope.sizeY = $scope.dimension; //tamaño inicial de y
    $scope.my = 0; //cantidad de peticiones de movimiento al eje y
    $scope.mx = 0; //cantidad de peticiones de movimiento al eje x
    $scope.zi = 0; //cantidad de peticiones al zoom
    $scope.imgUrl = "";

    $scope.capas = [];
    $scope.update = function () {
        $scope.dimension = parseInt($scope.selected.substring(0, $scope.selected.indexOf("x")));
        $scope.sizeX = $scope.dimension; //tamaño inicial de x
        $scope.sizeY = $scope.dimension; //tamaño inicial de y 
        $scope.cambiarTam();

    };

    $scope.printGeometryColumns = function () {

        $scope.layers.forEach(function (layer) {

            if (layer.estado === true && layer.llamada === false) {
                var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                myService.async(layer.nombre, conn).then(function (data) {
                    $scope.data = data;
                    layer.puntos = data;
                    console.log('data:', $scope.data);
                    $scope.drawInCanvasPoints(layer);                    
                });
                layer.llamada = true;
            }
        });
        $scope.showImgs();
    };

    $scope.drawInCanvasPoints = function (layer) {

        if (layer.estado === true && layer.llamada === true) {
            var canvas = document.getElementById(layer.nombre);
            var context = canvas.getContext('2d');

            layer.puntos.forEach(function (coordenada) {
                var x = coordenada[0];
                var y = coordenada[1];
                x = 10 + Math.round((x - 340735.03802508) / 430.145515478705);
                y = Math.round((y - 955392.16848899) / 430.145515478705);
                y = $scope.sizeY - y;
                context.beginPath();
                context.arc(x, y, 3, 0, 2 * Math.PI);
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
        console.log("conexion\n"+url);
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


    $scope.showImgs = function () {
        
        for (i = 0; i < $scope.layers.length; i++) {

            if ($scope.layers[i].estado === true) {
                var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass;
                var fun = "Imgs/imagen.php?x=" + $scope.sizeX + "&y=" + $scope.sizeY + "&zi=" + $scope.zi + "&mx=" + $scope.mx + "&my=" + $scope.my + "&capa=" + $scope.layers[i].nombre + "&tipo=" + $scope.layers[i].tipo;
                var url = fun + "&conn="+conn;
                $scope.layers[i].url = url;
                console.log($scope.layers[i].url);
            }
        }

    };
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
