/**
 * [module provinceCityCounty]
 */
/**
 * [module provinceCityCounty]
 * eg: <div province-city-county province="province" city="city" county="county" initdata="initdata"></div>
 * province ： 选择后的省对象
 * city:选择后的市对象
 * county:选择后的县数据
 * initdata 初始化数据：例如:{
     province: 'area_1',
     city: 'area_2',
     county: 'area_3'
   }
 */
angular.module('app').directive('provinceCityCounty', function() {
  var $areaData = {};
  return {
    priority: 1,
    restrict: 'EA',
    replace: true,
    scope: {
      province: '=',
      city: '=',
      county: '=',
      initdata: '='
    },
    templateUrl: 'js/directives/pcc.tpl.html',
    controller: ['$scope', '$http', '$q', function($scope, $http, $q) {
      $http.get('data/province.json').success(function(data) {
        $scope.provinces = data;
        if ($scope.initdata && $scope.initdata.province) {
          $scope.province = data.filter(function(
            pro) {
            return pro.area_id === $scope.initdata.province;
          })[0];
        }
      });
      $scope.getAllCites = function() {
        var defer = $q.defer();
        if ($areaData.citys) {
          defer.resolve($areaData.citys);
        } else {
          $http.get('data/city.json').success(function(data) {
            $areaData.citys = data;
            defer.resolve(data)
          });
        }
        return defer.promise;
      };
      $scope.getAllCountys = function() {
        var defer = $q.defer();
        if ($areaData.countys) {
          defer.resolve($areaData.countys);
        } else {
          $http.get('data/county.json').success(function(data) {
            $areaData.countys = data;
            defer.resolve(data)
          });
        }
        return defer.promise;
      }



    }],
    link: function($scope, elem, attrs) {
      $scope.province = null;
      $scope.filteredCities = [];
      $scope.filteredCountys = [];

      $scope.$watch('province', function(value) {
        $scope.filteredCountys.length = 0;
        $scope.city = $scope.county = null;
        if (value) {
          $scope.getAllCites().then(function(allcitys) {
            $scope.filteredCities = allcitys.filter(function(
              city) {
              return city.tree_code.slice(0, 3) === value.tree_code
                .slice(0, 3);
            });
            if ($scope.initdata && $scope.initdata.city) {
              $scope.city = $scope.filteredCities.filter(function(
                cit) {
                return cit.area_id === $scope.initdata.city;
              })[0];
            }
          });

        } else {
          $scope.filteredCities.length = 0;
        }
      });

      $scope.$watch('city', function(value) {
        $scope.county = null;
        if (value) {
          $scope.getAllCountys().then(function(allcountys) {
            $scope.filteredCountys = allcountys.filter(function(
              county) {
              return county.tree_code.slice(0, 6) === value.tree_code
                .slice(0, 6);
            });
            if ($scope.initdata && $scope.initdata.county) {
              $scope.county = $scope.filteredCountys.filter(function(
                cou) {
                return cou.area_id === $scope.initdata.county;
              })[0];
            }
          });
        } else {
          $scope.filteredCountys.length = 0;
        }
      });

      $scope.$watch('initdata', function(value) {
        if (!_.isEmpty(value) && $scope.provinces) {
          $scope.province = $scope.provinces.filter(function(
            pro) {
            return pro.area_id === value.province;
          })[0];
        } else {
          $scope.province = null;
        }
      });
    }
  }
})
