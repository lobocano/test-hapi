/**
 * Created by pablo on 16.03.16.
 */
angular.module('testHapi')
    .controller('HomeCtrl',['$scope','$location','$http', function ($scope,$location,$http) {

        $scope.title='Home';

        $scope.test=()=>{
            console.log('Test');

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
