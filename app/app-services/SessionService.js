(function () {
    'use strict';
angular
    .module('app')
    .factory('SessionService', SessionService);


    function SessionService ($injector) {
        "use strict";
        var service = {};

        service.checkAccess = checkAccess;

        return service;

        function checkAccess (event, toState) {

            // var $scope = $injector.get('$rootScope'),
            //     $sessionStorage = $injector.get('$sessionStorage');
            //
            // if (toState.data !== undefined) {
            //     if (toState.data.noLogin !== undefined && toState.data.noLogin) {
            //         // если нужно, выполняйте здесь какие-то действия
            //         // перед входом без авторизации
            //     }
            // } else {
            //     // вход с авторизацией
            //     if ($sessionStorage.user !== undefined) {
            //         $scope.$root.user = $sessionStorage.user;
            //     } else {
            //         // если пользователь не авторизован - отправляем на страницу авторизации
            //         event.preventDefault();
            //         $scope.$state.go('/');
            //     }
            // }
        };
    };

})();
