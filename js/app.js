//controlador del visor
var myApp = angular.module('app', ['FBAngular']);

myApp.controller('controller', function ($scope, Fullscreen, $http) {
    $scope.header = 'Conexion a Base de Datos';
    //$scope.body = 'Put here your body';
    $scope.footer = '';
    $scope.host = '';
    $scope.port = undefined;
    $scope.db = '';
    $scope.user = '';
    $scope.pass = undefined;

    /*
     * Funcion encargada de conectar a la base de datos deseada
     */
    $scope.myRightButton = function ()
    {
        var connUrl = './Queries/request.php?h=' + $scope.host + '&u=' + $scope.user + '&p=' + $scope.pass + '&port=' + $scope.port + '&db=' + $scope.db + '&name&type';
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
        templateUrl: './view/modal.html',
        transclude: true,
        controller: function ($scope) {
            $scope.handler = 'pop';
        }
    };
});