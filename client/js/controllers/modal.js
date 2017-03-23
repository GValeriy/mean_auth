myApp.controller('ModalAddCtrl', function ($scope,$uibModalInstance, $http, myService) {

    $scope.addWorker = function () {
        myService.addWorker($scope.worker).success(function (response) {
        });
    };

    this.ok = function () {
        $uibModalInstance.close('OK');
    }; // submit button

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});

myApp.controller('ModalEditCtrl', function ($scope,$uibModalInstance, worker,  $http, myService) {

    $scope.worker= worker;

    $scope.updateWorker = function () {
        $http.put('/api/workers/' + $scope.worker._id, $scope.worker).success(function (response) {
        });
    };


    this.ok = function () {
        console.log($scope);
        $uibModalInstance.close('OK');
    }; // submit button

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});