'use strict';

var app = angular.module('GAApp', ['ngResource', 'ui.router', 'gridster', 'ngDragDrop']);

app.config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $rootScope) {
        return {
            'request': function(config) {
                return config;
            },
            'requestError': function(rejection) {
                if(canRecover(rejection)) {
                    return responseOrNewPromise;
                }
                return $q.reject(rejection);
            },
            'response': function(response) {
                if(response.headers) {
                    delete response.headers;
                }
                if(response.config) {
                    delete response.config;
                }
                return response;
            },
            'responseError': function(rejection) {
                if(rejection.status == 400) {
                    $rootScope.$broadcast('LoginFailed');
                }
                return $q.reject(rejection);
            }
        }
    });
});

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'views/index.html',
            controller: 'indexController'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'views/dashboard.html',
            controller: 'dashboardController'
        })
        .state('dashboard.tabelManager', {
            url: '/tabelManager',
            templateUrl: 'views/dashboard_tableManager.html'
        })
        .state('dashboard.tabelManager.colum', {
            url: '/colum',
            templateUrl: 'views/dashboard_tableManager_colum.html'
        })
        .state('dashboard.tabelManager.addTable', {
            url: '/addTable',
            templateUrl: 'views/dashboard_tableManager_addTable.html'
        });
});
