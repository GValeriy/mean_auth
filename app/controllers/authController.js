app.controller('authController', function authController( userFactory,crudService, $scope) {
    console.log("authController loaded");
    'use strict';
    $scope.worker = null;
    crudService.getAll($scope.currentPage, 3).success(function (response) {
        $scope.totalItems = response.total;
        console.log($scope.totalItems);
        $scope.user = {};
        if( $scope.totalItems ) {
            $scope.user.role = 'Пользователь';
            console.log($scope.user.role);
        }
        else  {
            $scope.user.role = 'Администратор';
            console.log($scope.user.role);
        }
    });

    $scope.login= function (username, password) {
        userFactory.login(username, password).then(function success(response) {
            $scope.user = response.data.user;
            userFactory.getUser().then(function success(response) {
                var auth = response.data.role;
                console.log(auth);
                if ( auth === 'Администратор' ) location.href = '#/admin';
                if (auth === 'Пользователь' || auth === undefined || auth === null) location.href = '#/account';
                if (auth === 'Руководитель') location.href = '#/control';
            });
        }, handleError);
    };


    $scope.reg= function () {
        console.log('user', $scope.user);
        userFactory.reg($scope.user).then(function success(response) {
        }, handleError);
    };

    $scope.logout= function () {
        userFactory.logout();
        $scope.user = null;
    };

    function handleError(response) {
        alert('Error: ' + response.data);
    };

});
