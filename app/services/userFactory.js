var app = angular.module('app');

app.factory('userFactory', function userFactory($http, AuthInterceptor, $q) {
    'use strict';
    return {
        login: login,
        logout: logout,
        getUser: getUser,
        reg: reg
    };

    function login(username, password) {
        return $http.post('/api/users/login', {
            username: username,
            password: password
        }).then(function success(response) {
            AuthInterceptor.setToken(response.data.token);
            return response;
        });
    };

    function reg(user) {
        return $http.post('/api/users/register', user).then(handleSuccess, handleError);
    };

    function logout() {
        AuthInterceptor.setToken();
    };

    function getUser() {
        if (AuthInterceptor.getToken()) {
            return $http.get('/api/users/me');
        } else {
            return $q.reject({ data: 'client has no auth token' });
        }
    };
    // private functions
    function handleSuccess(res) {
        return res.data;
    };
    function handleError(res) {
        return $q.reject(res.data);
    };
    
});
