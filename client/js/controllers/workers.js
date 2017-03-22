var myApp = angular.module('myApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

myApp.controller('WorkersController', function ($scope, $http, $log, $uibModal, myService, $document) {
    console.log("WorkersController loaded... ");

    var $openCtrl = this;
    $openCtrl.animationsEnabled = true;

    $openCtrl.openAdd = function () {
        var modalInstance = $uibModal.open({
            animation: $openCtrl.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalAddCtrl',
            controllerAs: '$addCtrl',
            resolve: {
                m: function () {
                    return console.log("openAdd")
                }
            }
        });
        modalInstance.result.then(function (data) {
            myService.getWorkers($scope.currentPage).success(function (response) {
                $scope.itemsPerPage = response.limit;
                $scope.totalItems = response.total;
                $scope.currentPage = response.page;
                $scope.workers = response.docs;
            });
        });
    };
    $openCtrl.openEdit = function (worker_id) {
        var modalInstance = $uibModal.open({
            animation: $openCtrl.animationsEnabled,
            templateUrl: 'editContent.html',
            controller: 'ModalEditCtrl',
            controllerAs: '$editCtrl',
            resolve: {
                m: function () {
                    return console.log("openEdit")
                },
                provider: {worker_id: worker_id}
            }
        });
        modalInstance.result.then(function (data) {
            myService.getWorkers($scope.currentPage).success(function (response) {
                $scope.itemsPerPage = response.limit;
                $scope.totalItems = response.total;
                $scope.currentPage = response.page;
                $scope.workers = response.docs;
            });
        });
    };

    myService.getWorkers($scope.currentPage, $scope.searchWord).success(function (response) {
        $scope.itemsPerPage = response.limit;
        $scope.totalItems = response.total;
        $scope.currentPage = response.page;
        $scope.workers = response.docs;
    });

    $scope.pageChanged = function () {
        myService.getWorkers($scope.currentPage, $scope.searchWord).success(function (response) {
            $scope.totalItems = response.total;
            $scope.currentPage = response.page;
            $scope.workers = response.docs;

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


});