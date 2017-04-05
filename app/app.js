(function () {
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
                // data: {activeTab: 'home'}
                // ,
                data: {
            needAdmin: false
        }
                //     ,
                // role: user.role}
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                resolve: {
                    // contacts: function (UserService) {
                    //     return UserService.GetCurrent().then(function (user) {
                    //         console.log('State resolve, ', user.role);
                    //     });
                    //
                    // },
                },
                data: {
                    needAdmin: true
                }
                // data: {activeTab: 'home'}

            })
    };

    function run($http, $rootScope,$state, $window,UserService) {
        // add JWT token as default auth header

        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;


        // update active tab on state change
        // $rootScope.$on('$stateChangeSuccess', function (event, toState) {

            // $rootScope.activeTab = toState.data.activeTab;

        //
        // });

        $rootScope.$on('$stateChangeSuccess', function(e, to) {

            UserService.GetCurrent().then(function (user) {

                console.log("$stateChangeStart, ", user.role);

                var auth = user.role;
                // var auth = 'Администратор1';

                if (to.data.needAdmin && auth !== 'Администратор') {
                    e.preventDefault();
                    $state.go('home');
                }
            // $state.go('home');
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