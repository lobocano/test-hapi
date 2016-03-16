/**
 * Created by pablo on 16.03.16.
 */
angular.module('testHapi')
    .controller('HomeCtrl',['$scope','$location','$http','$cookies','localStorageService', function ($scope, $location, $http, $cookies, localStorageService) {

        $scope.title='Home';

        $scope.test=()=>{
            var usr = $cookies.get('test-hapi-cookie');
            console.log(usr);
            //console.log(document.cookie);
            usr =  localStorageService.get('user');
            console.log(usr);

        };
        $scope.logout=()=>{
            console.log('Logout');
            $http.get('/auth/logout')
                .error(function(err){console.log('error ',err)})
                .then(function(result) {
                    console.log(result.data);
                    localStorageService.remove('user');
                    alert(result.data);

                });

        }


    }]);
