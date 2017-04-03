var myApp = angular.module('myApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'mgcrea.ngStrap','ui.mask']);

myApp.controller('WorkersController', function ($scope, $http, $log, $uibModal, myService, $document) {
    console.log("WorkersController loaded... ");


    // MODAL WINDOWS

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
            myService.getWorkers($scope.currentPage,$scope.itemsPerPage).success(function (response) {
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
    };

// CRUD

    myService.getWorkers($scope.currentPage,3).success(function (response) {
        $scope.itemsPerPage = response.limit;
        $scope.totalItems = response.total;
        $scope.currentPage = response.page;
        $scope.workers = response.docs;
    });

    $scope.removeWorker = function (id) {
        myService.removeWorker(id);
        myService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
            $scope.totalItems = response.total;
            $scope.currentPage = response.page;
            $scope.workers = response.docs;
            $scope.itemsPerPage = response.limit;
        });
    };

    // PAGINATION

    $scope.pageChanged = function () {
        myService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
            $scope.totalItems = response.total;
            $scope.currentPage = response.page;
            $scope.workers = response.docs;
            $scope.itemsPerPage = response.limit;

        });
    };
    $scope.setItemsPerPage = function(num) {
        $scope.itemsPerPage = num;
        myService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
            $scope.totalItems = response.total;
            $scope.workers = response.docs;
            $scope.itemsPerPage = response.limit;
        });

        $scope.currentPage = 1; //reset to first page
    }
});