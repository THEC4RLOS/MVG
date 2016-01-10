//Controlador del visor
var myApp = angular.module('app', ['FBAngular']);

myApp.controller('controller', function ($scope, Fullscreen, $http) {

    $scope.header = 'Conexion a Base de Datos';
    $scope.footer = '';
    $scope.host = 'localhost';
    $scope.port = 5432;
    $scope.db = 'cursoGIS';
    $scope.user = 'postgres';
    $scope.pass = 12345;
    $scope.layers; // todas las caas disponibles

    $scope.printGeometryColumns = function () {
        $scope.layers.forEach(function (layer) {
            console.log('nombre:', layer.nombre, 'estado:', layer.estado);
        });
    };

    $scope.getGeometryColumns = function () {
        // Accion del boton Base de Datos

        var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass + '';
        var func = './Queries/request2.php?func=getGeometryColumns&conn=';
        var url = '';
        url = func + conn;
        //console.log(url);
        $http({method: 'GET', url: url}).
                then(
                        function (response)
                        {
                            // $scope.response = response;
                            $scope.layers = response.data;
                            console.log(response);
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

        var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass + '';
        var func = './Queries/request2.php?func=connect&conn=';
        var url = '';
        url = func + conn;
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
    $scope.hospitales = Array();
    $scope.arrayToSend = Array();
    var conn = 'host=' + $scope.host + '%20port=' + $scope.port + '%20dbname=' + $scope.db + '%20user=' + $scope.user + '%20password=' + $scope.pass + '&name=hospitales';
    var func = './Queries/request2.php?func=getPoints&conn=';
    var url = '';
    url = func + conn;
    console.log(url);
    $scope.getPoints = function () {
        $http({method: 'GET', url: url}).
                then(function (response) {
                    $scope.hospitales = response;
                    console.log('yaaaaa');
                    /* $scope.hospitales.data.forEach(function (value) {
                     for (i = 0; i < value.coordenada.coordinates.length;i++ ){
                     console.log("x: " + value.coordenada.coordinates[i][0]+"i: "+i);
                     console.log("y: " + value.coordenada.coordinates[i][1]+"i: "+i);
                     }
                     
                     });*/

                    //console.log($scope.hospitales.data[1].coordenada.coordinates[0]);
                    var depuredArray = Array();

                    for (i = 0; i < $scope.hospitales.data.length; i++) {
                 
                        if ($scope.hospitales.data[i] !== null) {
                            for (j = 0; j < $scope.hospitales.data[i].coordenada.coordinates.length-1; j++) {

                                depuredArray.push($scope.hospitales.data[i].coordenada.coordinates[j]);
                            }
                        }
                    }


                    $scope.arrayToSend = depuredArray;
                    //console.log($scope.arrayToSend);
                    //$scope.sendArray($scope.arrayToSend);

                }, function () {
                    console.log("Error obteniendo los hospitales");
                });
    };
    $scope.obtenerHospitales();

    $scope.sendArray = function (arreglot) {

        $.ajax({
            type: "POST",
            url: "receptor.php",
            data: {array: JSON.stringify(arreglot)},
            success: function (data) {
                console.log(data);

            }, error: function () {
                console.log("ErrroRRRRSAAURIO!");
            }
        });

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
            pass: '=pass'
        },
        templateUrl: './view/modal_dbConnect.html',
        transclude: true,
        controller: function ($scope) {
            $scope.handler = 'pop';
        }
    };
});