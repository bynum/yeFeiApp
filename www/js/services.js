angular.module('starter.services', [])
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
        },
        setCities: function (value) {
            $window.localStorage["cities"] = JSON.stringify(value);
        },
        getCities: function () {
            if (!$window.localStorage["cities"]) {
                var cities = [{ 'name': '北京', 'id': '101010100' }, { 'name': '上海', 'id': '101020100' }, { 'name': '贵阳', 'id': '101260101' }];
                $window.localStorage["cities"] = JSON.stringify(cities);
            }
            return JSON.parse($window.localStorage["cities"]);
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
}])
.factory('AppService', ['$q', '$http', function ($q, $http) {
    
    //var accessToken = "";
    return {
       /* login: function (loginData) {
            var d = $q.defer();
            var promise = d.promise;
            $http.post("http://www.52yefei.com/Token", {
                params: loginData
            }).success(function (data) {
                d.resolve(data);
            }).error(function (error) {
                      d.reject(error);
                  });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return d.promise;
        }*/
        /****************login*********************/
        login:function(loginData){
            var serverBaseUrl = "http://www.52yefei.com";
            var tokenUrl = serverBaseUrl + "/Token";
            if (!loginData.grant_type) {
                loginData.grant_type = "password";
            }
            var d = $q.defer();
            var promise = d.promise;
            $http({
                method: 'POST',
                url: tokenUrl,
                data: loginData,
            }).success(function (data, status, headers, cfg) {
                // save the access_token as this is required for each API call. 
                //accessToken = data.access_token;
                // check the log screen to know currently back from the server when a user log in successfully.
                //console.log(data);
                d.resolve(data);
            }).error(function (err, status) {
                //console.log(err);
                d.reject(status);
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return d.promise;
        },
        /****************login*********************/
        
        /****************login*********************/
        myForecast:function(myForecastData){
            var serverBaseUrl = "http://www.52yefei.com";
            var url = serverBaseUrl + "/api/values/";
            var d = $q.defer();
            var promise = d.promise;
            $http({
                method: 'POST',
                url: url,
                data: myForecastData,
                headers: getHeaders(),
            }).success(function (data, status, headers, cfg) {
                // save the access_token as this is required for each API call. 
                // check the log screen to know currently back from the server when a user log in successfully.
                //console.log(data);
                d.resolve(data);
            }).error(function (err, status) {
                //console.log(err);
                d.reject(status);
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return d.promise;
        }
        /****************login*********************/
    }
    function getHeaders() {
            //if (accessToken) {
            //    return { "Authorization": "Bearer " + accessToken };
            //}
            return { "Authorization": "Bearer " + sessionStorage.getItem('accessToken') };
        }
}])

.factory('Forecast', function ($q, $http) {
    //var timestamp = new Date().Format("yyyyMMddhhmmss");
    return {
        getForecastById: function (id) {
            var d = $q.defer();
            var promise = d.promise;
            var url = "https://route.showapi.com/9-2";
            $http.get(url, {
                params: {
                    areaid: id,
                    showapi_timestamp: new Date().Format("yyyyMMddhhmmss"),
                    showapi_appid: '5982',
                    showapi_sign: '1ed301d57eaa4b4f801800d218cbdc8e',
                    needHourData: '0',
                    needIndex: '0',
                    needMoreDay: '1'
                }
            }).success(function (data) {
                d.resolve(data);
            }).error(function (error) {
                d.reject(error);
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return d.promise;
        },
        getForecastByGeo: function () {
            var d = $q.defer();
            var promise = d.promise;
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (geoInfo) {
                var url = "https://route.showapi.com/9-5?from=5";
                $http.get(url, {
                    params: {
                        lng: geoInfo.longitude,
                        lat: geoInfo.latitude,
                        showapi_timestamp: new Date().Format("yyyyMMddhhmmss"),
                        showapi_appid: '5982',
                        showapi_sign: '1ed301d57eaa4b4f801800d218cbdc8e',
                        needHourData: '0',
                        needIndex: '0',
                        needMoreDay: '1'
                    }
                }).success(function (data) {
                    d.resolve(data);
                }).error(function (error) {
                    d.reject(error);
                });
            }, function (error) {
                d.reject(error);
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return d.promise;
        }
    }
});