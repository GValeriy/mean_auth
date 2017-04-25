(function () {
    'use strict';

angular.module('app').factory('crudService', crudService);

function crudService($http, $q) {

    var service = {};

    service.GetCurrent = GetCurrent;
    service.getAll = getAll;
    service.GetById = GetById;
    service.GetByUsername = GetByUsername;
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;

    return service;

    function getAll (page, limit) {
        return $http.get('/api/users', {
            params: {
                page: page,
                limit: limit
            }
        });
    };
    function GetCurrent() {
        return $http.get('/api/users/current').then(handleSuccess, handleError);
    };
    function GetById(_id) {
        return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
    };
    function GetByUsername(username) {
        return $http.get('/api/users/' + username).then(handleSuccess, handleError);
    };
    function Create(user) {
        return $http.post('/api/users/register', user).then(handleSuccess, handleError);
    };
    function Update(user) {
        return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
    };
    function Delete(_id) {
        return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
    };
    // private functions
    function handleSuccess(res) {
        return res.data;
    };
    function handleError(res) {
        return $q.reject(res.data);
    };

};

})();