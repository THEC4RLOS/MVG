//controlador del visor
var myApp = angular.module('app', []);

myApp.controller('controller', function ($scope, $http) {
    $scope.header = 'Put here your header';
    $scope.body = 'Put here your body';
    $scope.footer = 'Put here your footer';
    $scope.myRightButton = function (bool) {
        alert('!!! first function call!');
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
            handler: '=lolo'
        },
        templateUrl: './view/modal.html',
        transclude: true,
        controller: function ($scope) {
            $scope.handler = 'pop';
        }
    };
});