/**
 * Created by pablo on 15.03.16.
 */
angular.module('testHapi')
    .controller('LoginCtrl', ['$scope', '$location', '$http', 'AuthService', function ($scope, $location, $http, AuthService) {

        $scope.title = 'Login form';
        $scope.user = {
            email: '',
            password: ''
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
                        AuthService.setUser(result.data.user);
                        $location.path('/');
                    }
                    else alert(result.data);

                });

        }
    }]);
