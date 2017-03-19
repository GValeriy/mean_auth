var myApp = angular.module('myApp', ['ui.bootstrap']);

myApp.controller('WorkersController', ['$scope', '$http', 'myService', function ($scope, $http, myService) {
    console.log("WorkersController loaded... ")


    myService.getWorkers(1).success(function (response) {

        $scope.totalItems = response.total;
        $scope.currentPage = response.page;

        $scope.workers = response.docs;
        console.log($scope.workers);

    });

    $scope.pageChanged = function ()
    {
        console.log('Page changed to: ' + $scope.currentPage);
        myService.getWorkers($scope.currentPage).success(function (response) {
            $scope.totalItems = response.total;
            $scope.currentPage = response.page;
            $scope.workers = response.docs;
            console.log($scope.workers);

            // $scope.setItemsPerPage = function(num) {
            //     $scope.itemsPerPage = num;
            //     $scope.currentPage = 1; //reset to first paghe
            // }

        });
    };




    $scope.addWorker = function () {
        myService.addWorker($scope.worker).success(function (response) {

            // $scope.worker._id=serverIDworker;

            $scope.workers.push($scope.worker);
            $scope.worker="";
            console.log ($scope.worker,"- worker",$scope.workers,"- workers");
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
        // $http.put('/api/workers/' + id, $scope.worker).success(function (response) {
            Service.updateWorker(id, $scope.worker).success(function (response) {
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