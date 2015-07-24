var app = angular.module('GAApp', ['ngResource', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'views/index.html'
        });
});
