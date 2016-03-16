/**
 * Created by pablo on 16.03.16.
 */
angular.module('testHapi')
    .controller('HomeCtrl',['$scope','$location','$http','AuthService', function ($scope, $location, $http,AuthService) {

        $scope.title='Home';
        $scope.username = function(){
            return AuthService.user() ? AuthService.user().displayname : '';
        };
        console.log('$scope.username',$scope.username());
        $scope.AuthService = AuthService;
        $scope.test=()=>{
            console.log('stored user',$scope.AuthService.user(), $scope.AuthService.isAuthenticated(), $scope.username());
            $scope.$apply();
        };
        $scope.logout=()=>{
            console.log('Logout');
            $http.get('/auth/logout')
                .error(function(err){console.log('error ',err)})
                .then(function(result) {
                    console.log(result.data);
                    $scope.AuthService.removeUser();
                    //alert(result.data);

                });

        };

        $scope.message='';
        $scope.messages = [];
        $scope.addMsg = ()=>{
            console.log('$scope.addMsg');
        };

    }]);
