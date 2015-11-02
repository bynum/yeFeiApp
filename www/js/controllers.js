angular.module('starter.controllers', ['starter.services', 'ngResource'])

    .controller('AppCtrl', function ($scope,ls, AppService, $ionicModal, $timeout, $rootScope, $ionicActionSheet) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        
        $scope.cities = ls.getCities();
        $scope.change = function () {
            return ls.getCities().length;
        }
        //***监听cities的个数的变化，如果监听cities的变化，因为每次都是return一个new的cities，所以程序会卡死！！！！
        //***注意，监听的必须是？$scope自己的对象，不确定。
        $scope.$watch($scope.change, function (newValue, oldValue) {
            $scope.cities = ls.getCities();
        })
        //删除city
        $scope.remove = function (city) {
            $scope.cities.splice($scope.cities.indexOf(city), 1);
            ls.setCities($scope.cities);
        }
        
       
        /*********用户登录操作 ***********/
        //先从浏览器中读取本地数据，如果‘userName’存在，则不再显示登录。
        $rootScope.userName = sessionStorage.getItem('userName');
        console.log($rootScope.userName);
        // Form data for the login modal
        $scope.loginData = {};
        var tokenKey = 'accessToken';
        var userName = "userName";
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };
        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);
            $scope.loginData.grant_type = 'password';
            AppService.login($scope.loginData).success(function (data) {
                console.log(data);
                $rootScope.userName = data.userName;
                sessionStorage.setItem(userName, data.userName);
                sessionStorage.setItem(tokenKey, data.access_token);
                $scope.closeLogin();
            }).error(function (data) {
                console.log(data);
            });
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
        
            //$timeout(function () {
            //    $scope.closeLogin();
            //}, 1000);
        };
        /*********用户登录操作 ***********/
        
        /*********用户注销操作 ***********/
        
        $scope.showActionSheet = function () {
            // 显示操作表
            $ionicActionSheet.show({
                buttons: [
                    { text: '更换用户' },
                    { text: '注销' },
                ],
                titleText: '用户操作',
                cancelText: '取消',
                buttonClicked: function (index) {
                    switch (index) {
                        case 0:
                            $scope.login();
                            break;
                        case 1:
                            $rootScope.userName = null;
                            sessionStorage.removeItem(userName);
                            sessionStorage.removeItem(tokenKey);
                            break;
                    }
                    return true;
                }
            });
        }
        /*********用户注销操作 ***********/
        /*********我的预报操作 ***********/
        // Form data for the login modal
        $scope.myForecastData = {};
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/myForecast.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.myForecastModal = modal;
        });

        // Triggered in the login myForecastModal to close it
        $scope.closeMyForecast = function () {
            $scope.myForecastModal.hide();
        };

        // Open the login modal
        $scope.showMyForecast = function () {
            $scope.myForecastModal.show();
        };
        // Perform the login action when the user submits the login form
        $scope.doMyForecast = function () {
            console.log('Doing MyForecast', $scope.myForecastData);

            AppService.myForecast($scope.myForecastData).success(function (data) {
                console.log(data);
                $scope.closeLogin();
            }).error(function (data) {
                console.log(data);
            });
            
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
        
            $timeout(function () {
                $scope.closeMyForecast();
            }, 1000);
        };
        /*********我的预报操作 ***********/
    })

    .controller('ForecastCtrl', function (Forecast, $scope, $stateParams, $rootScope) {
        $scope.num2weekdayCN = function (num) {
            switch (num) {
                case 1: return "一";
                case 2: return "二";
                case 3: return "三";
                case 4: return "四";
                case 5: return "五";
                case 6: return "六";
                case 7: return "日";
            }
        }
        if ($stateParams.id) {
            Forecast.getForecastById($stateParams.id)
                .success(function (data) {
                    $scope.dataBody = data.showapi_res_body;
                }).error(function (data) {

                });
            $scope.doRefresh = function () {
                Forecast.getForecastById($stateParams.id)
                    .success(function (data) {
                        console.log(123);
                        $scope.dataBody = data.showapi_res_body;
                    })
                    .finally(function () {
                        // 停止广播ion-refresher
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            };
            /* var url = "https://route.showapi.com/9-2";
             $http.get(url, {
                 params: {
                     areaid: $stateParams.id,
                     showapi_timestamp: timestamp,
                     showapi_appid: '5982',
                     showapi_sign: '1ed301d57eaa4b4f801800d218cbdc8e',
                     needHourData: '0',
                     needIndex: '0',
                     needMoreDay: '1'
                 }
             }).success(function (data) {
                 $scope.dataBody = data.showapi_res_body;
             })
                   .error(function (error) {
                       console.log(error);
                   });
                */
        } else {
            Forecast.getForecastByGeo().success(function (data) {
                $scope.dataBody = data.showapi_res_body;
                $rootScope.currentCity = { name: data.showapi_res_body.cityInfo.c3, id: data.showapi_res_body.cityInfo.c1 };
            }).error(function (data) {

            });
            $scope.doRefresh = function () {
                Forecast.getForecastByGeo()
                    .success(function (data) {
                        $scope.dataBody = data.showapi_res_body;
                        $rootScope.currentCity = { name: data.showapi_res_body.cityInfo.c3, id: data.showapi_res_body.cityInfo.c1 };
                    })
                    .finally(function () {
                        // 停止广播ion-refresher
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            };
            /*
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (geoInfo) {
                var url = "https://route.showapi.com/9-5?from=5";
                $http.get(url, {
                    params: {
                        lng: geoInfo.longitude,
                        lat: geoInfo.latitude,
                        showapi_timestamp: timestamp,
                        showapi_appid: '5982',
                        showapi_sign: '1ed301d57eaa4b4f801800d218cbdc8e',
                        needHourData: '1',
                        needIndex: '1',
                        needMoreDay: '1'
                    }
                }).success(function (data) {
                    $scope.dataBody = data.showapi_res_body;
                    $rootScope.currentCity = { name: data.showapi_res_body.cityInfo.c3, id: data.showapi_res_body.cityInfo.c1 };
                })
                        .error(function (error) {
                            console.log(error);
                        });
            }, function (err) {
            });
            */
        }
    })
    .controller('AreaCtrl', function ($scope, $resource, $stateParams, ls) {
        $scope.addCity = function (cityName, cityId) {
            var city = { name: cityName, id: cityId };
            var cities = ls.getCities();
            console.log(cities);
            cities.push(city);
            ls.setCities(cities);
        }
        //$scope.provinceId=$stateParams.provinceId;
        //$scope.cityId=$stateParams.cityId;
        /*$http.get('js/city.json').success(function (data) {
             for(var i=0;i<data.China.province.length;i++){
               if(data.China.province[i].id==$stateParams.provinceId){
                   console.log(data.China.province[i].name);
                   $scope.province=data.China.province[i];
                   console.log($scope.province);
                   break;
                }
           }
             })
             .error(function (error) {
                 console.log(error);
             });  
        */
        var obj = $resource('js/city.json');
        obj.get({}, function (data) {
            $scope.provinces = data.China.province;
            if ($stateParams.provinceId) {
                $scope.provinceId = $stateParams.provinceId;
                for (var i = 0; i < data.China.province.length; i++) {
                    if (data.China.province[i].id == $stateParams.provinceId) {
                        $scope.province = data.China.province[i];
                        if ($stateParams.cityId) {
                            $scope.cityId = $stateParams.cityId;
                            for (var j = 0; j < $scope.province.city.length; j++) {
                                if ($scope.province.city[j].id == $stateParams.cityId) {
                                    $scope.city = $scope.province.city[j];
                                }
                            }
                        }

                        break;
                    }
                }
            }

        });
        //方案三 在view层用ng-if嵌套即可
        /* var obj=$resource('js/city.json');
         $scope.country=obj.get();
         */
    })
    .controller('DsljCtrl', function ($scope) {
        /*
        
        百度地图坐标查询:
        http://api.map.baidu.com/lbsapi/getpoint/
        
        var longitude = 113.738487;
        var latitude = 34.361282;
        $scope.mapOptions = {
            center: {
                longitude: longitude,
                latitude: latitude
            },
            zoom: 15,
            city: 'Xinzheng',
            markers: [{
                longitude: longitude,
                latitude: latitude,
                icon: 'http://img.coolwp.com/wp-content/uploads/2015/04/48-map-marker.png',
                width: 48,
                height: 48,
                title: '在哪儿',
                content: '新郑市梨河镇'
            }]
        };
*/
        $scope.init = function () {
            /********************Baidu Map Api************************ */
            var map = new BMap.Map("allmap");            // 创建Map实例
            map.setMapStyle({
                styleJson: [
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": {
                            "color": "#ffffff",
                            "visibility": "off"
                        }
                    },
                    {
				                    "featureType": "road",
				                    "elementType": "all",
				                    "stylers": {
                            "color": "#ffffff",
                            "visibility": "off"
				                    }
                    },
                    /*{
				                    "featureType": "background",
				                    "elementType": "all",
				                    "stylers": {
                            "color": "#ffffff"
				                    }
                    },
                    */
                    /*{
				                    "featureType": "administrative",
				                    "elementType": "all",
				                    "stylers": {
                            "color": "#ffffff",
                            "visibility": "off"
				                    }
                    }*/
                ]
            });
 
            //map.centerAndZoom(new BMap.Point(116.403765, 39.914850), 5);
            map.enableScrollWheelZoom();
            var point = new BMap.Point(116.404, 39.915); // 创建点坐标
            map.centerAndZoom(point, 15);
            map.enableScrollWheelZoom();                 //启用滚轮放大缩小
            
            
        }
    })
    .controller("PlayListCtrl", function ($scope, $http,$ionicModal,$timeout) {
        // console.log($location.path().substr(5));
       /* $scope.shouldRightSideMenuBeEnabled = function () {
            if ($location.path().substr(5) == 'playlist') {
                return true;
            } else {
                return false;
            }
        }
        */
        /*********我的预报操作 ***********/
        // Form data for the checks modal
        $scope.myChecksData = {};
        // Create the checks modal that we will use later
        $ionicModal.fromTemplateUrl('templates/myChecks.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.myChecksModal = modal;
        });

        // Triggered in the login myForecastModal to close it
        $scope.closeMyChecks = function () {
            $scope.myChecksModal.hide();
        };

        // Open the login modal
        $scope.showMyChecks = function () {
            $scope.myChecksModal.show();
        };
        // Perform the login action when the user submits the login form
        $scope.doMyChecks = function () {
            console.log('Doing MyChecks', $scope.myChecksData);
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
        
            $timeout(function () {
                $scope.closeMyForecast();
            }, 1000);
        };
        /*********用户登录操作 ***********/
        var map = L.map('map').setView([26.58, 106.72], 7);
        var markers = [];
        function onEachFeature(feature, layer) {

            var icon = new L.TextIcon(
                {
                    temperature: feature.properties.temperature,
                    rH: feature.properties.rH,
                    color: 'red',
                    windNum: parseInt((feature.properties.windPower - 0.01) / 2),
                    windDirection: feature.properties.windDirection
                }
                );
            var marker = L.marker(feature.geometry.coordinates.reverse(), { icon: icon }).addTo(map);
            markers.push(marker);
            //marker.options.icon.removeElement("rHDiv");
            
            var popupContent = "<p>I started out as a GeoJSON " +
                feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

            if (feature.properties && feature.properties.popupContent) {
                popupContent += feature.properties.popupContent;
            }
            layer.bindPopup(popupContent);
        }

        $scope.init = function () {
            $http.get('lib/map.json')
                .success(function (response) {
                    var myLines = response;
                    var myStyle = {
                        "color": "#ff7800",
                        "weight": 2,
                        "opacity": 0.65
                    };
                    L.geoJson(myLines, {
                        style: myStyle
                    }).addTo(map);

                })
                .error(function (data) { 
                    //错误代码             
                });
            L.geoJson([bicycleRental], {
                style: function (feature) {
                    return feature.properties && feature.properties.style;
                },
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 4,
                        fillColor: "#ff7800",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                }
            }).addTo(map);
        };
        $scope.refresh = function () {
            for (var i = 0; i < markers.length; i++) {
                markers[i].options.icon.setElementHiddden(0);
            }
        };
    })
;
