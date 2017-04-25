(function () {
    'use strict';

    angular.module('app').controller('workersController', Controller);

    function Controller($window, crudService, $scope, $uibModal, FlashService) {
        console.log("workersController loaded");

        var workCtrl = this;
        workCtrl.worker = null;
        workCtrl.saveUser = saveUser;
        workCtrl.deleteUser = deleteUser;
        initController();

        function initController() {
            // get current user
            crudService.GetCurrent().then(function (user) {
                workCtrl.worker = user;
            });
            crudService.getAll($scope.currentPage, 3).success(function (response) {
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
                crudService.getAll($scope.currentPage, $scope.itemsPerPage).success(function (response) {
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
            crudService.getAll($scope.currentPage, $scope.itemsPerPage).success(function (response) {
                $scope.totalItems = response.total;
                $scope.currentPage = response.page;
                $scope.workers = response.docs;
                $scope.itemsPerPage = response.limit;
            });
        };
        $scope.setItemsPerPage = function (num) {
            $scope.itemsPerPage = num;
            crudService.getAll($scope.currentPage, $scope.itemsPerPage).success(function (response) {
                $scope.totalItems = response.total;
                $scope.workers = response.docs;
                $scope.itemsPerPage = response.limit;
                $scope.currentPage = 1; //reset to first page
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
        function saveUser() {
            crudService.Update( workCtrl.worker).then(function () {
                FlashService.Success('User updated');
            })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        };
            $scope.removeWorker = function (_id) {
                // log admin out
                crudService.GetCurrent().then(function (user) {
                    workCtrl.worker = user;
                    console.log(workCtrl.worker._id, _id);
                    if (workCtrl.worker._id === _id) {
                        $window.location = '/login';
                    }
                });
                crudService.Delete(_id)
                    .then(function () {
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
                if (workCtrl.worker.role === 'Пользователь' || workCtrl.worker.role === undefined) {
                    crudService.Delete(workCtrl.worker._id)
                        .then(function () {
                        })
                        .catch(function (error) {
                            FlashService.Error(error);
                        });
                    // log user out
                    $window.location = '/login';
                }
                crudService.getAll($scope.currentPage, $scope.itemsPerPage).success(function (response) {
                    $scope.totalItems = response.total;
                    $scope.currentPage = response.page;
                    $scope.workers = response.docs;
                    $scope.itemsPerPage = response.limit;
                });
            };
        };
})();