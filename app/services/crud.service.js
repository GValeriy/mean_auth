(function () {
    'use strict';

angular.module('app').factory('crudService', crudService);

function crudService($http) {

    var service = {};

    service.getWorker = getWorker;
    service.addWorker = addWorker;
    service.getWorkers = getWorkers;
    service.removeWorker = removeWorker;
    service.GetCurrent = GetCurrent;
    service.GetAll = GetAll;
    service.GetById = GetById;
    service.GetByUsername = GetByUsername;
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;

    return service;

    function getWorker (id) {
        return $http.get("/workers/" + id);
    };

    function addWorker (worker) {
        return $http.post('/workers/', worker);
    };

    function getWorkers (page, limit) {
        return $http.get("/workers", {
            params: {
                page: page,
                limit: limit
            }
        });
    };

    function removeWorker (id) {
        return $http.delete('/workers/' + id);
    };

    function GetCurrent() {
        return $http.get('/api/users/current').then(handleSuccess, handleError);
    };

    function GetAll() {
        return $http.get('/api/users').then(handleSuccess, handleError);
    };

    function GetById(_id) {
        return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
    };

    function GetByUsername(username) {
        return $http.get('/api/users/' + username).then(handleSuccess, handleError);
    };

    function Create(user) {
        return $http.post('/api/users', user).then(handleSuccess, handleError);
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