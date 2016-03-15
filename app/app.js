/**
 * Created by pablo on 15.03.16.
 */
angular.module('testHapi', [
    'ngRoute'
]).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    console.log('config');
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'home.html'
        })
        .when('/home', {
            templateUrl: 'home.html'
        })
        .when('/login',{
            templateUrl: 'views/login.html'
        })
        .when('/register',{
            templateUrl: 'views/register.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);


