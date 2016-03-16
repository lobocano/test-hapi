/**
 * Created by pablo on 16.03.16.
 */
angular.module('testHapi')
    .controller('HomeCtrl',['$scope','$location','$http','$cookies', function ($scope, $location, $http, $cookies) {

        $scope.title='Home';

        $scope.test=()=>{
            var usr = $cookies.get('userdata');
            console.log(usr);
            console.log(document.cookie);

        };
        $scope.logout=()=>{
            console.log('Logout');
            $http.get('/auth/logout')
                .error(function(err){console.log('error ',err)})
                .then(function(result) {
                    console.log(result.data);
                    alert(result.data);

                });

        }


    }]);
