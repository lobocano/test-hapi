/**
 * Created by pablo on 15.03.16.
 */
angular.module('testHapi')
    .controller('RegisterCtrl',['$scope','$location','$http','localStorageService', function ($scope,$location,$http,localStorageService) {
        
        $scope.title='Register form';
        $scope.user = {
            email:'',
            displayname:'',
            password:'',
            password2:''
        };
        $scope.register=()=>{
            console.log('Register',$scope.user);
            $http.post('/auth/register', $scope.user)
                .error(function(err){console.log('error ',err)})
                .then(function(result) {
                    if (result.data.status && result.data.status == 'OK') {
                        console.log(result.data.user);
                        localStorageService.set('user', result.data.user);
                        $location.path('/');
                    }
                    else {
                        alert(result.data);
                    }
                });

            $location.path('/');
        }

    }]);
