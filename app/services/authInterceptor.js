var app = angular.module('app');

app.factory('AuthInterceptor', function AuthInterceptor($window) {
    'use strict';
    var store = $window.localStorage;
    var key = 'auth-token';
    return {
        request: addToken,
        getToken: getToken,
        setToken: setToken
    };

    function getToken() {
        return store.getItem(key);
    };

    function setToken(token) {
        if (token) {
            store.setItem(key, token);
        } else {
            store.removeItem(key);
        }
    };

    function addToken(config) {
        var token = getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    };
});