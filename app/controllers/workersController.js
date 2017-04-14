(function () {
    'use strict';

    angular.module('app').controller('workersController', Controller);

    function Controller($window, crudService,$scope, $uibModal,  FlashService) {
        console.log("workersController loaded");
        var workCtrl = this;

        workCtrl.worker = null;

        workCtrl.saveUser = saveUser;
        workCtrl.deleteUser = deleteUser;
        workCtrl.saveInfo = saveInfo;

        initController();

        function initController() {
            // get current user
            crudService.GetCurrent().then(function (user) {
                workCtrl.worker = user;
            });

            crudService.getWorkers($scope.currentPage,3).success(function (response) {
                $scope.itemsPerPage = response.limit;
                $scope.totalItems = response.total;
                $scope.currentPage = response.page;
                $scope.workers = response.docs;
            });

        };

// Modal windows

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
                crudService.getWorkers($scope.currentPage,$scope.itemsPerPage).success(function (response) {
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

            });
        };

        // CRUD
        $scope.pageChanged = function () {
            crudService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
                $scope.totalItems = response.total;
                $scope.currentPage = response.page;
                $scope.workers = response.docs;
                $scope.itemsPerPage = response.limit;
            });
        };
        $scope.setItemsPerPage = function(num) {
            $scope.itemsPerPage = num;
            crudService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
                $scope.totalItems = response.total;
                $scope.workers = response.docs;
                $scope.itemsPerPage = response.limit;
                $scope.currentPage = 1; //reset to first page
            });
        };
        function saveUser() {
            crudService.Update(workCtrl.worker).then(function () {
                FlashService.Success('User updated');
            })
                .catch(function (error) {
                    FlashService.Error(error);
                });

        };
       function saveInfo () {
            crudService.updateWorker($scope.worker).then(function () {
                FlashService.Success('User updated');
            })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        };

        function deleteUser() {
            crudService.Delete(workCtrl.worker._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        };
        $scope.removeWorker = function (id) {
            crudService.removeWorker(id);
            crudService.getWorkers($scope.currentPage, $scope.itemsPerPage).success(function (response) {
                $scope.totalItems = response.total;
                $scope.currentPage = response.page;
                $scope.workers = response.docs;
                $scope.itemsPerPage = response.limit;
            });
        };

    };

})();