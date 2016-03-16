/**
 * Created by pablo on 15.03.16.
 */
angular.module('testHapi', [
    'ngRoute',
    'ngMaterial',
    'ngCookies'
]).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    console.log('config');
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'HomeCtrl'
        })
        .when('/home', {
            templateUrl: 'home.html'
        })
        .when('/login',{
            templateUrl: 'components/login/login.html',
            controller: 'LoginCtrl'
        })
        .when('/register',{
            templateUrl: 'components/register/register.html',
            controller: 'RegisterCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);


