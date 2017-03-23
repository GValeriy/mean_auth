var myApp = angular.module('myApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

myApp.controller('WorkersController', function ($scope, $http, $log, $uibModal, myService, $document) {
    console.log("WorkersController loaded... ");

    this.animationsEnabled = true;

    this.openAdd = function () {
        var modalInstance = $uibModal.open({
            animation: this.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalAddCtrl',
            controllerAs: '$addCtrl',
            resolve: {
                m: function () {
                    return console.log("openAddModal")
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
    this.openEdit = function (worker) {
        var modalInstance = $uibModal.open({
            animation: this.animationsEnabled,
            templateUrl: 'editContent.html',
            controller: 'ModalEditCtrl',
            controllerAs: '$editCtrl',
            resolve: {
                m: function () {
                    return console.log("openEditModal")
                },
                worker: worker
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

    myService.getWorkers($scope.currentPage, 5).success(function (response) {
        console.log ( $scope.itemsPerPage);
        $scope.itemsPerPage = response.limit;
        console.log(response.limit);
        $scope.totalItems = response.total;
        $scope.currentPage = response.page;
        $scope.workers = response.docs;
    });


    $scope.setItemsPerPage = function(num) {

        $scope.itemsPerPage = num;

        console.log($scope.itemsPerPage);

        myService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
            console.log ( "myserviceGetWOrkers", $scope.itemsPerPage);
            $scope.totalItems = response.total;
            $scope.workers = response.docs;
            $scope.itemsPerPage = response.limit;

        });
        $scope.currentPage = 1; //reset to first page
    }

    $scope.pageChanged = function () {
        myService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
            console.log ( "myserviceGetWOrkers", $scope.itemsPerPage);
            $scope.totalItems = response.total;
            $scope.currentPage = response.page;
            $scope.workers = response.docs;
            $scope.itemsPerPage = response.limit;

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