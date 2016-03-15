/**
 * Created by pablo on 15.03.16.
 */
angular.module('testHapi')
    .controller('RegisterCtrl',['$scope','$location','$http', function ($scope,$location,$http) {
        
        $scope.title='Register form';
        $scope.user = {
            username:'',
            email:'',
            displayName:'',
            password:'',
            password2:''
        };
        $scope.register=()=>{
            console.log('Register',$scope.user);
            $http.post('/auth/register', $scope.user)
                .error(function(err){console.log('error ',err)})
                .then(function(result) {
                    if(result.data == 'OK'){
                        console.log(result);
                        $location.path('/');

                    }
                    else {
                        alert(result.data);
                    }
                });

            $location.path('/');
        }

    }]);
