(function () {
    'use strict';

angular.module('app').factory('crudService', crudService);

function crudService($http, $q) {

    var service = {};


    service.getAll = getAll;
    service.Create = Create;
    service.Authenticate = Authenticate;
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

    function Create(user) {
        return $http.post('/api/users/register', user).then(handleSuccess, handleError);
    };
    function Update(user) {
        console.log(user);
        return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
    };
    function Delete(_id) {
        return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
    };
    function Authenticate(user) {
        return $http.post('/login', user).then(handleSuccess, handleError);
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