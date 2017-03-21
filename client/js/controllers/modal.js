
myApp.controller('ModalInstanceCtrl', function ($scope,$uibModalInstance, $http, myService) {
    console.log("ModalInstanceCtrl loaded... ")

    var $ctrl = this;

    $scope.addWorker = function () {
        myService.addWorker($scope.worker).success(function (response) {
            console.log($scope.worker, "- worker", $scope.workers, "- workers");
        });
    };

    $ctrl.ok = function () {
        $uibModalInstance.close('OK');
    }; // submit button

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});

myApp.controller('ModalEditCtrl', function ($scope,$uibModalInstance, $http, myService) {
    console.log("ModalInstanceCtrl loaded... ")

    var $ctrl = this;
    var worker_id = $scope.$resolve.provider.worker_id;
    console.log(worker_id);

    myService.getWorker(worker_id).success(function (response) {
        $scope.worker = response;
    });

    // $scope.getWorker = function (worker_id) {
    //     console.log(worker_id);
    // }



    $scope.updateWorker = function () {
        $http.put('/api/workers/' + worker_id, $scope.worker).success(function (response) {
            for (i in $scope.workers) {
                if ($scope.workers[i]._id === id) {
                    $scope.workers[i] = $scope.worker;
                }
            }
        });
    };


    // $scope.updateWorker = function (id) {
    //     console.log(id);
    //     }

    $ctrl.ok = function () {
        console.log($scope);
        $uibModalInstance.close('OK');
    }; // submit button

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});