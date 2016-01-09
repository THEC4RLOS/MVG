//controlador del visor
var myApp = angular.module('app', ['FBAngular']);

myApp.controller('controller', function ($scope, Fullscreen, $http, $sce) {
    $scope.header = 'Conexion a Base de Datos';
    //$scope.body1 = '<center><p>Host</p><input  id="host" type="text" class="form-control" placeholder="localhost" ng-model="host"><p>Puerto</p><input  id="port" type="text" class="form-control" placeholder="5432" ng-model="port"><p>Base de Datos</p><input  id="db" type="text" class="form-control" placeholder="cursoGIS" ng-model="db"><p>Usuario</p><input  id="user" type="text" class="form-control" placeholder="postgres" ng-model="user"><p>Contraseña</p><input  id="pass" type="text" class="form-control" placeholder="12345" ng-model="pass"></center>';
    //$scope.body = $sce.trustAsHtml($scope.body1);
    $scope.footer = '';
    $scope.host = '';
    $scope.port = undefined;
    $scope.db = '';
    $scope.user = '';
    $scope.pass = undefined;
    $scope.button = 1;

    //$scope.MytrustedHtml = $sce.trustAsHtml('<span><h1>trustedHtml text</h1></span>'); <div ng-bind-html="MytrustedHtml"></div>
    /*$scope.set = function (a)
    {
        $scope.button = a;
    };*/
    /*
     * Funcion encargada de conectar a la base de datos deseada
     */
    $scope.myRightButton = function (a)
    {
        // Accion del boton Base de Datos
        if (a === 1) {
            
            var connUrl = './Queries/request.php?h=' + $scope.host + '&u=' + $scope.user + '&p=' + $scope.pass + '&port=' + $scope.port + '&db=' + $scope.db + '&name&type';
            console.log(connUrl);
            $http({method: 'GET', url: connUrl}).
                    then(
                            function (response)
                            {
                                $scope.response = response;
                                if ($scope.response.data === 'ok') {
                                    $scope.footer = 'Conexion exitosa';

                                } else {
                                    $scope.footer = 'Error al conectar';
                                }
                            }
                    );
        } else if (a === 2) {
            // Accion del boton Capas
            console.log("boton capas");
        }
    };

    $scope.myRhightButton = function (bool) {
        alert('!!! first function call!');
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