/**
 * Created by vg on 4/27/17.
 */

(function () {
    'use strict';

    var app=angular.module('app');


    angular.module('app').controller('loginController', Controller);

    function Controller(crudService, FlashService) {
        console.log("loginController loaded");

        var logCtrl = this;

        logCtrl.authenticateUser = authenticateUser;

        function authenticateUser(worker) {

            crudService.Authenticate(worker).then(function () {
                FlashService.Success('Welcome');
            })
                .catch(function (error) {
                    FlashService.Success('Error');
                    FlashService.Error(error);
                });
        };

    };
})();