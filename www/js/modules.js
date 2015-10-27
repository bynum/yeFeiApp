angular.module('app.services', [])
.factory('ls', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '[]');
        }
    }
}])
.factory('baiduGeo', ['$q', function ($q) {
    return {
        getCurrtenGeoInfo: function () {
            var deferred = $q.defer();
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
}]);