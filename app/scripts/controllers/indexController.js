app.controller('indexController', ['$scope', '$timeout', 'Service', '$location', function($scope, $timeout, Service, $location) {
    var data = $scope.data = {};
    var fn = $scope.fn = {};

    $scope.data.title = 'Gulp Angular'.split('');

    var lockPanel = angular.element(document.querySelector('#lockPanel'))[0];
    var lockDot = angular.element(document.querySelector('#lockDot'))[0];
    var unlockArea = angular.element(document.querySelector('#unlockArea'))[0];
    var baseDotLeft = lockPanel.offsetLeft;
    var baseDotRight = lockPanel.offsetLeft + lockPanel.offsetWidth - 30;
    var disX = 0;
    lockDot.onmousedown = function(event) {
        disX = event.clientX - this.offsetLeft;
        document.onmousemove = function(event) {
            var dis = event.clientX - disX;
            lockDot.style.left = dis + 'px';
            unlockArea.style.width = (event.target.offsetLeft - baseDotLeft + 30) + 'px';
            if(dis < baseDotLeft) {
                lockDot.style.left = baseDotLeft + 'px';
                unlockArea.style.width = '0px';
            }
            if(dis > baseDotRight) {
                lockDot.style.left = baseDotRight + 'px';
                unlockArea.style.width = lockPanel.offsetWidth + 'px';
            }
        }
        document.onmouseup = function(event) {
            document.onmousemove = null;
            document.onmouseup = null;
            if(unlockArea.offsetWidth == lockPanel.offsetWidth) {
                $scope.fn.unlockDB();
            }
        }
    }

    var input = angular.element(document.querySelector('input[name="username"]'))[0];
    $scope.$on('LoginFailed', function(data) {
        if(data) {
            input.style.border = '1px solid #FF0000';
            input.style.boxShadow = '0 0 3px 0 #FF0000';
        }
    });

    $scope.fn = {
        unlockDB: function() {
            Service.unlockDB($scope.data.secretWord.toUpperCase()).then(function(data) {
                input.style.border = '1px solid #FFFFFF';
                input.style.boxShadow = '';
                $location.path('/dashboard');
            });
        }
    }
}]);
