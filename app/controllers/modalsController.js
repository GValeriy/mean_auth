var app=angular.module('app');

app.controller('ModalAddCtrl', function ($scope,$uibModalInstance, $http, crudService) {

    $scope.addWorker = function () {
        crudService.Create($scope.worker).then(function (response) {
        });
    };

    this.ok = function () {
        $uibModalInstance.close('OK');
    }; // submit button

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});

app.controller('ModalEditCtrl', function ($scope,$uibModalInstance,crudService,FlashService, worker) {

    $scope.worker= worker;

    $scope.saveUser = function () {
        crudService.Update($scope.worker).then(function () {
            FlashService.Success('User updated');
        })
            .catch(function (error) {
                FlashService.Error(error);
            });
    };

    this.ok = function () {
        $uibModalInstance.close('OK');
    }; // submit button

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});