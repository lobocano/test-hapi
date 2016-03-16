/**
 * Created by pablo on 16.03.16.
 */
angular.module('testHapi')
.service('AuthService',['localStorageService','$cookies', function(localStorageService,$cookies){
    return {
        isAuthenticated: ()=>{
            return $cookies.get('test-hapi-cookie') != undefined;
        },
        user: ()=>{
            return localStorageService.get('user');
        },
        setUser: (user)=>{
            localStorageService.set('user', user);
        },
        removeUser: ()=>{
            localStorageService.remove('user');
        }
    };
}]);