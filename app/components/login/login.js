/**
 * Created by pablo on 15.03.16.
 */
angular.module('testHapi')
    .controller('LoginCtrl',['$scope','$location','$http', function ($scope,$location,$http) {

        $scope.title='Login form';
        $scope.user = {
            username:'',
            password:''
        };

        $scope.login=()=>{
            console.log('Login',$scope.user);
            $http.post('/auth/login', $scope.user)
                .error(function(err){console.log('error ',err)})
                .then(function(result) {
                    console.log(result.data);
                    if(result.data == 'OK'){
                        $location.path('/');
                    }
                    else alert(result.data);

                });

        }
    }]);
