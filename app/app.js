﻿(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ui.mask', 'mgcrea.ngStrap', 'ngSanitize'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider,$httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/admin',
                templateUrl: 'views/admin.html',
                controller: 'workersController',
                controllerAs: 'workCtrl',
                data: {
                    role: 'admin'
                }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'views/user.html',
                controller: 'workersController',
                controllerAs: 'workCtrl',
                data: {
                    role: 'user'
                }
            })
            .state('control', {
                url: '/control',
                templateUrl: 'views/control.html',
                controller: 'workersController',
                controllerAs: 'workCtrl',
                data: {
                    role: 'control'
                }
            })
            .state('login', {
                url: '/',
                templateUrl: 'views/login.html',
                controller: 'authController',
                controllerAs: 'authCtrl',
                data: {

                }
            })
    };

    function run($http, $rootScope,$state, $window, crudService,userFactory) {

        // add JWT token as default auth header
        $rootScope.$on('$stateChangeSuccess', function(e, to) {

            // crudService.GetCurrent().then(function (user) {
            //     console.log("asdasd",user);

                // userFactory.getUser().then(function success(response) {
                //     var user = response.data;
                //     console.log('User is ', response);
                // });
                // var auth = user.role;
                // console.log("asdasd",auth);
                // if (to.data.role !=='admin' && auth === 'Администратор' ) {
                //     e.preventDefault();
                //     alert("Упс! Простите, но с учетной записи администратора вам доступна только страница админа...");
                //     $state.go('home');
                // }
                // if (to.data.role !== 'user' && auth === 'Пользователь' || auth === undefined) {
                //     e.preventDefault();
                //     alert("Упс! Простите, но с учетной записи пользователя вам доступна только страница с вашей информацией...");
                //     $state.go('account');
                // }
                // if (to.data.role !== 'control' && auth === 'Руководитель') {
                //     e.preventDefault();
                //     alert("Упс! Простите, но с учетной записи руководителя вам доступна только страница руководителя...");
                //     $state.go('control');
                // }
            // });
        });
    };

    $(function () {
            angular.bootstrap(document, ['app']);
    });

    })();

