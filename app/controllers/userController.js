(function () {
    'use strict';

    angular.module('app').controller('userController', Controller);

    function Controller( crudService, $scope, FlashService, userFactory) {
        console.log("userController loaded");

        initController();
        $scope.logout= function () {
            userFactory.logout();
        };
        function initController() {
            userFactory.getUser().then(function success(response) {
                $scope.worker = response.data;
            });
        };
        $scope.save = function (worker) {
            crudService.Update(worker).then(function () {
            }).catch(function (error) {});
        };

    };
})();
