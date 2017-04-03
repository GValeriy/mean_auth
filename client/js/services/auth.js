myApp.service('AuthService', function($cookies, $http, Restangular) {
        'use strict';

        var self = this;
        this.status = {
            authorized: false,
        };

        this.loginByCredentials = function(username, password) {
            return Restangular.all('sessions').post({ email: username, password: password })
                .then(function(response) {
                    return self.loginByToken(response.contents);
                });
        };

        this.loginByToken = function(token) {
            $http.defaults.headers.common['X-Token'] = token;

            return Restangular.all('sessions').get(token)
                .then(function(response) {
                    $cookies.accessToken = token;
                    self.status.authorized = true;
                    return response;
                });
        };

        this.logout = function() {
            self.status.authorized = false;
            $cookies.accessToken = '';

            Restangular.all('sessions').remove();
        };
    });