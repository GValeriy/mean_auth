var app=angular.module('app');

app.controller('ModalAddCtrl', function ($scope,$uibModalInstance, $http, crudService) {

    $scope.addWorker = function () {

        crudService.addWorker($scope.worker).success(function (response) {

        });
    };

    this.ok = function () {
        $uibModalInstance.close('OK');
    }; // submit button

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});

app.controller('ModalEditCtrl', function ($scope,$uibModalInstance, worker,  $http) {

    $scope.worker= worker;

    $scope.updateWorker = function () {
        $http.put('/workers/' + $scope.worker._id, $scope.worker).success(function (response) {

        });
    };

    this.ok = function () {
        $uibModalInstance.close('OK');
    }; // submit button

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});