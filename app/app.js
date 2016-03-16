/**
 * Created by pablo on 15.03.16.
 */
angular.module('testHapi', [
    'ngRoute',
    'ngMaterial',
    'ngCookies',
    'LocalStorageModule'
]).config(['$routeProvider', '$locationProvider','localStorageServiceProvider', function ($routeProvider, $locationProvider, localStorageServiceProvider) {
    console.log('config');
    $locationProvider.html5Mode(true);
    localStorageServiceProvider.setPrefix('testHapi');
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


