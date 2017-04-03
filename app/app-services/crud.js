(function () {
    'use strict';
angular
    .module('app')
    .factory('crudService', crudService);


function crudService($http) {

// service('myService',  function ($http) {

    var service = {};

    service.getWorker = getWorker;
    service.addWorker = addWorker;
    service.getWorkers = getWorkers;
    service.removeWorker = removeWorker;


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
};

})();