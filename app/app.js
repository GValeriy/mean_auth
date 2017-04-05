﻿(function () {
    'use strict';

        angular
        .module('app', ['ui.router','ngAnimate','ui.bootstrap','ui.mask', 'mgcrea.ngStrap', 'ngSanitize'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {

        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'WorkersController',
                controllerAs: 'workCtrl',
                data: {
            role: 'admin'
        }

            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: {
                    role: 'user'
                }

            })
            .state('control', {
                url: '/control',
                templateUrl: 'home/control.html',
                controller: 'WorkersController',
                controllerAs: 'workCtrl',
                data: {
                    role: 'control'
                }

            })
    };

    function run($http, $rootScope,$state, $window,UserService) {
        // add JWT token as default auth header

        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        $rootScope.$on('$stateChangeSuccess', function(e, to) {
            // $rootScope.activeTab = toState.data.activeTab;
            UserService.GetCurrent().then(function (user) {

                console.log("$stateChangeStart, ", user.role);
                var auth = user.role;

                if (to.data.role ==='admin' && auth !== 'Администратор' ) {


                    if (to.data.role === 'user' && auth !== 'Пользователь') {
                        $state.go('control');
                        console.log("Вы руководитель ");
                    }
                    else
                    {
                        e.preventDefault();
                        $state.go('account');
                        console.log("Вы Пользователь ");
                    }

                }

            });
        });
    };

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });

})();