var myApp = angular.module('myApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
// 'ngAnimate', 'ngSanitize',

myApp.controller('WorkersController', function ($scope, $http, $log, $uibModal, myService, $document) {
    console.log("WorkersController loaded... ")

    var $ctrl = this;
    $ctrl.animationsEnabled = true;

    $ctrl.openAdd = function () {

        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            resolve: {
                m: function () {
                    return console.log("openAdd")
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            $log.info('modal-component dismissed at: ' + new Date());
        });
    };



    $ctrl.openEdit = function (worker_id) {
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            templateUrl: 'editContent.html',
            controller: 'ModalEditCtrl',
            controllerAs: '$ctrl1',
            resolve: {
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
            console.log($scope.worker);
        });
    }

    $scope.newUser = function (id) {
        $scope.worker = "";

    }

    $scope.updateWorker = function (id) {
        console.log($scope.worker);
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
        $ctrl.close();
    }; // submit button

    $ctrl.cancel = function () {
        $ctrl.dismiss();
    }; // cancel button

});