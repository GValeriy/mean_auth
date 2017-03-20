var myApp = angular.module('myApp', ['ngAnimate', 'ngSanitize','ui.bootstrap']);
// 'ngAnimate', 'ngSanitize',
myApp.controller('WorkersController', ['$scope', '$http', 'myService', function ($uibModalInstance, $scope, $http, myService) {
    console.log("WorkersController loaded... ")

    myService.getWorkers($scope.currentPage).success(function (response) {
           $scope.itemsPerPage = response.limit;
           $scope.totalItems = response.total;
           $scope.currentPage = response.page;
                $scope.workers = response.docs;
            });

    $scope.pageChanged = function () {
        myService.getWorkers($scope.currentPage).success(function (response) {
            $scope.totalItems = response.total;
            $scope.currentPage = response.page;
            $scope.workers = response.docs;

        });
    };

    $scope.addWorker = function () {
        myService.addWorker($scope.worker).success(function (response) {
            console.log($scope.worker, "- worker", $scope.workers, "- workers");
        });
        myService.getWorkers($scope.currentPage).success(function (response) {
            $scope.itemsPerPage = response.limit;
            $scope.totalItems = response.total;
            $scope.currentPage = response.page;
            $scope.workers = response.docs;

        });
    };

    $scope.getWorker = function (id) {
        myService.getWorker(id).success(function (response) {
            $scope.worker = response;
        });
    }

    $scope.newUser = function (id) {
        $scope.worker = "";

    }

    $scope.updateWorker = function (id) {
        $http.put('/api/workers/' + id, $scope.worker).success(function (response) {
            for (i in $scope.workers) {
                if ($scope.workers[i]._id === id) {
                    $scope.workers[i] = $scope.worker;
                }
            }
        });
    };

    $scope.removeWorker = function (id) {
        myService.removeWorker(id);
        for (i in $scope.workers) {
            if ($scope.workers[i]._id === id) {
                $scope.workers.splice(i, 1);
            }
        }
    };
$ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected.item);
}; // submit button

$ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
}; // cancel button
}]);