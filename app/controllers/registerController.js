(function () {
    'use strict';

    var app=angular.module('app');


    angular.module('app').controller('registerController', Controller);

    function Controller($window, crudService, FlashService) {
        console.log("registerController loaded");

        var regCtrl = this;

        regCtrl.registrateUser = registrateUser;

        function registrateUser(worker) {

            crudService.Create(worker).then(function () {
                FlashService.Success('User registrated');
                $window.location = '/#/login';
            })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        };



    };
})();