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
    $scope.geomColumns;

    $scope.printGeometryColumns = function () {
        $scope.geomColumns.forEach(function (entry) {
            console.log('nombre:', entry.nombre, 'estado:', entry.estado);
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
                            $scope.geomColumns = response.data;
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