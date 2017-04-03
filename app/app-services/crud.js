
angular
    .module('app')
    .factory('crudService', Service);


function Service($http) {

// service('myService',  function ($http) {

    this.getWorker = function (id) {
        return $http.get("/api/workers/" + id);
    };

    this.addWorker = function (worker) {
        return $http.post('/api/workers/', worker);
    };

    this.getWorkers = function (page, limit) {
        return $http.get("/api/workers", {
            params: {
                page: page,
                limit: limit
            }
        });
    };

    this.removeWorker = function (id) {
        return $http.delete('/api/workers/' + id);
    };
};

// });