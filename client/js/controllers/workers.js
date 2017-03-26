var myApp = angular.module('myApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

myApp.controller('WorkersController', function ($scope, $http, $log, $uibModal, myService, $document) {
    console.log("WorkersController loaded... ");



    $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.mytime = d;
    };




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
        modalInstance.result.then(function (data) {
            myService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
            });
        });
    };
    $scope.setItemsPerPage = function(num) {
        $scope.itemsPerPage = num;
        console.log($scope.itemsPerPage);
        myService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
            $scope.workers = response.docs;
        });
        $scope.currentPage = 1; //reset to first page
    }

    myService.getWorkers($scope.currentPage, 5).success(function (response) {
        $scope.itemsPerPage = response.limit;
        $scope.totalItems = response.total;
        $scope.currentPage = response.page;
        $scope.workers = response.docs;
    });


    $scope.pageChanged = function () {
        myService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
            $scope.workers = response.docs;
        });
    };

    $scope.removeWorker = function (id) {
        myService.removeWorker(id);
        myService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
            $scope.totalItems = response.total;
            $scope.currentPage = response.page;
            $scope.workers = response.docs;
            $scope.itemsPerPage = response.limit;
            if ($scope.workers=='') {
                myService.getWorkers($scope.currentPage-1, $scope.itemsPerPage).success(function (response) {
            });
            }
        });
    };

});