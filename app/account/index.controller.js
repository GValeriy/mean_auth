(function () {
    'use strict';

    angular.module('app').controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.worker = null;

        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            // get current user
            console.log("initController loaded");

            UserService.GetCurrent().then(function (user) {
                vm.worker = user;
                console.log();
            });

        };

        function saveUser() {

            UserService.Update(vm.worker).then(function () {
                    FlashService.Success('User updated');
                })

                .catch(function (error) {
                    FlashService.Error(error);
                });

        };

        function deleteUser() {
            UserService.Delete(vm.worker._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        };

    };

})();