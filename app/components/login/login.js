/**
 * Created by pablo on 15.03.16.
 */
angular.module('testHapi')
    .controller('LoginCtrl', ['$scope', '$location', '$http', 'localStorageService', function ($scope, $location, $http, localStorageService) {

        $scope.title = 'Login form';
        $scope.user = {
            email: 'test@mail.ru',
            password: '123'
        };

        $scope.login = ()=> {
            console.log('Login', $scope.user);
            $http.post('/auth/login', $scope.user)
                .error(function (err) {
                    console.log('error ', err)
                })
                .then(function (result) {
                    console.log(result.data);
                    if (result.data.status && result.data.status == 'OK') {
                        console.log(result.data.user);
                        localStorageService.set('user', result.data.user);
                        $location.path('/');
                    }
                    else alert(result.data);

                });

        }
    }]);
