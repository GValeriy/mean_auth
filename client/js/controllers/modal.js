
myApp.controller('ModalInstanceCtrl', function ($scope,$uibModalInstance, $http, myService) {
    console.log("ModalInstanceCtrl loaded... ")

    var $ctrl = this;

    $scope.addWorker = function () {
        myService.addWorker($scope.worker).success(function (response) {
            console.log($scope.worker, "- worker", $scope.workers, "- workers");
        });
    };

    $ctrl.ok = function () {
        $uibModalInstance.close();
    }; // submit button

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});

myApp.controller('ModalEditCtrl', function ($scope,$uibModalInstance,  $http, myService) {
    console.log("ModalInstanceCtrl loaded... ")

    var $ctrl = this;

    // $scope.getWorker = function (worker_id) {
    //     console.log($scope.worker);
    //     myService.getWorker(id).success(function (response) {
    //         $scope.worker = response;
    //     });
    // }

    // $scope.getWorker = function (worker_id) {
    //     console.log(worker_id);
    // }



    // $scope.updateWorker = function (id) {
    //     $http.put('/api/workers/' + id, $scope.worker).success(function (response) {
    //         for (i in $scope.workers) {
    //             if ($scope.workers[i]._id === id) {
    //                 $scope.workers[i] = $scope.worker;
    //             }
    //         }
    //     });
    // };


    // $scope.updateWorker = function (id) {
    //     console.log(id);
    //     }

    $ctrl.ok = function () {
        $uibModalInstance.close();
    }; // submit button

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});