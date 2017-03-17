var myApp = angular.module('myApp', []);

myApp.controller('WorkersController', ['$scope', '$http', 'myService', function ($scope, $http, myService) {
    console.log("WorkersController loaded... ")


    myService.getWorkers().success(function (response) {

        $scope.workers = response;
        console.log($scope.workers);


    });

    $scope.addWorker = function () {
        myService.addWorker($scope.worker).success(function (response) {
            $scope.workers.push($scope.worker);
        });
    };

    $scope.getWorker=function(id) {
        myService.getWorker(id).success(function (response) {
            $scope.worker = response;
        });
    }
    $scope.newUser=function(id) {
        $scope.worker="";

    }
    $scope.updateWorker = function (id) {
        $http.put('/api/workers/' + id, this.worker).success(function (response) {

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

}]);