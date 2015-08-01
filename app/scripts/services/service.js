app.service('Service', ['$http', function($http) {
    this.unlockDB = function(secretWord) {
        return $http.post('/api/unlockDB', {secretWord: secretWord}).then(function(data) {
            return data;
        });
    };

    this.getTables = function() {
        return $http.get('/api/getTables').then(function(data) {
            return data;
        });
    };

    this.createTable = function(tableName, params) {
        return $http.post('/api/createTable?tableName=' + tableName, params).then(function(data) {
            return data;
        });
    };

    this.dropTable = function(tableName) {
        return $http.post('/api/dropTable?tableName=' + tableName).then(function(data) {
            return data;
        });
    };
}]);
