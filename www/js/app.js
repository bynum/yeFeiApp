// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.services', 'starter.controllers'])
    .directive("appMap", function () {
        return {
            restrict: "E",
            replace: true,
            template: "<div id='allMap'></div>",
            scope: {
                center: "=",		// Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
                markers: "=",	   // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
                width: "@",		 // Map width in pixels.
                height: "@",		// Map height in pixels.
                zoom: "@",		  // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
                zoomControl: "@",   // Whether to show a zoom control on the map.
                scaleControl: "@",   // Whether to show scale control on the map.
                address: "@"
            },
            link: function (scope, element, attrs) {
                var map;
                // 百度地图API功能
                map = new BMap.Map("allMap");
                map.addControl(new BMap.ZoomControl());
                // 创建地址解析器实例
                var myGeo = new BMap.Geocoder();
                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint(scope.address, function (point) {
                    if (point) {
                        map.centerAndZoom(point, 16);
                        map.addOverlay(new BMap.Marker(point));
                    }
                }, "");
            }
        };
    })
    .run(function ($ionicPlatform, $rootScope, baiduGeo, ls) {
        $ionicPlatform.ready(function () {
            /* var cities = ls.getObject("citise");
            if (cities.length == 0) {
                var geoInfo = baiduGeo.getCurrtenGeoInfo();
                geoInfo.then(function (data) {  // 调用承诺API获取数据 .resolve  
                    cities.push({ latitude: data.latitude, longitude: data.longitude });
                    console.log(data);
                    $rootScope.data = data;
                }, function (data) {  // 处理错误 .reject  
    
                });
            }
            ls.setObject("citise", cities);
            console.log($rootScope.data);
            */
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];


        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                cache: false,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.forecastCurrentCity', {
                url: '/forecast',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/forecast.html',
                        controller: 'ForecastCtrl'
                    }
                }
            })
            .state('app.forecast', {
                url: '/forecast/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/forecast.html',
                        controller: 'ForecastCtrl'
                    }
                }
            })

            .state('app.country', {
                url: '/area',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/country.html',
                        controller: 'AreaCtrl'
                    }
                }
            })
            .state('app.province', {
                url: '/area/:provinceId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/province.html',
                        controller: 'AreaCtrl'
                    }
                }
            })
            .state('app.city', {
                url: '/area/:provinceId/:cityId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/city.html',
                        controller: 'AreaCtrl'
                    }
                }
            })
            .state('app.dslj', {
                url: '/dslj',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dslj.html',
                        controller: 'DsljCtrl'
                    }
                }
            })
            .state('app.playlist', {
                url: '/playlist',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlist.html',
                        controller: 'PlayListCtrl'
                    }
                }
            })
        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/forecast');
    });
