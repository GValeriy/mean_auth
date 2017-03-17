myApp.service('myService', ['$http', function ($http) {

    this.getWorker = function (id) {
        var url = "/api/workers/" + id;
        return $http.get(url);
    };

    this.addWorker = function (worker) {
        return $http.post('/api/workers/', worker);
    }
    this.updateWorker = function (id) {
        return $http.put('/api/workers/' + id, this.worker);
    };


    this.getWorkers = function () {
     return $http.get("/api/workers/");
    };


    this.removeWorker = function (id) {
      return  $http.delete('/api/workers/' + id);
    };


}]);